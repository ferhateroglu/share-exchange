import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { Order, User, Portfolio } from "../models";
import {
  OrderRepository,
  UserRepository,
  PortfolioRepository,
  OrderBookRepository,
  ShareRepository,
} from "../repositories";
import { RedisClientType } from "../db/inMemory.db";

import PortfolioController from "./portfolio.controller";
import { type } from "os";

interface OrderParams extends Order {
  time?: number;
  symbolPair: string;
  side: "BUY" | "SELL";
  userId: string;
}

export default class OrderController {
  private repository: OrderRepository;
  private userRepository: UserRepository;
  private orderBookRepository: OrderBookRepository;
  private shareRepository: ShareRepository;
  private portfolioRepository: PortfolioRepository;

  constructor(redisClient: RedisClientType) {
    this.repository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.shareRepository = new ShareRepository();
    this.portfolioRepository = new PortfolioRepository();
    this.orderBookRepository = new OrderBookRepository(redisClient);
  }

  public create = async (req: Request, res: Response) => {
    try {
      const order: OrderParams = req.body;
      order.id = uuidv4();

      // check limit order price is worse than best price then reject
      if (order.type === "LIMIT") {
        const isPriceWorse = await this.isPriceWorse(order);

        if (isPriceWorse) {
          return res.status(403).send({
            message: "Price is worse than current market price!",
          });
        }
      }

      // check quantity is less then order reject
      const isBalanceEnough = await this.checkBalance(order);

      if (!isBalanceEnough) {
        return res.status(403).send({
          message: "Not enough balance!",
        });
      }

      // lock the balance
      const isBalanceLocked = await this.lockBalance(order);

      // if balance is not locked reject
      if (!isBalanceLocked) {
        return res.status(403).send({
          message: "Failed to lock balance!",
        });
      }

      // save order
      const savedOrder = await this.saveOrder(order);

      console.log("savedOrder", savedOrder);

      // limit order
      if (order.type === "LIMIT") {
        // match order
        const matchs = await this.matchLimitOrder(order);
        if (matchs.length > 0)
          return res.status(200).send({
            message: "Order created!",
            matchs,
          });
      } else if (order.type === "MARKET") {
        // TODO: market order
      }

      return res.status(200).send({
        message: "Order created!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Some error occurred while retrieving orders.",
      });
    }
  };

  private matchLimitOrder = async (order: any): Promise<[]> => {
    const matchs: any = [];

    while (order.quantity > 0) {
      let [bestOrder]: any = await this.getBestPrice(
        order.side,
        order.symbolPair
      );

      // if there is no record in order-book, no match, add order to order-book
      if (!bestOrder) {
        order = { time: Date.now(), ...order };
        await this.orderBookRepository.setByScore(order);
        return matchs;
      }
      const makerOrder = JSON.parse(bestOrder);

      if (order.side === "BUY" && order.price < makerOrder.price) {
        order = { time: Date.now(), ...order };
        await this.orderBookRepository.setByScore(order);
        return [];
      } else if (order.side === "SELL" && order.price > makerOrder.price) {
        order = { time: Date.now(), ...order };
        await this.orderBookRepository.setByScore(order);
        return [];
      }

      // maker order is sold
      if (order.quantity >= makerOrder.quantity) {
        const takerId = order.userId;

        matchs.push({ takerId, ...makerOrder });

        // update taker order quantity
        order.quantity -= makerOrder.quantity;

        // remove maker order from order book
        await this.orderBookRepository.removeByOrder(bestOrder);
      }
      // taker order is sold
      else if (order.quantity < makerOrder.quantity) {
        const takerId = order.userId;

        makerOrder.quantity -= order.quantity;

        matchs.push({ takerId, ...makerOrder });

        order.quantity = 0;

        // update maker order quantity
        await this.orderBookRepository.removeByOrder(bestOrder);
        await this.orderBookRepository.setByScore(makerOrder);
      }
    }

    return matchs;
  };

  // TODO: market order
  private matchMarketOrder = async (order: OrderParams) => {};

  // check if order price is worse than best price
  private isPriceWorse = async (order: OrderParams) => {
    let [bestPrice] = await this.getBestPrice(order.side, order.symbolPair); // strinify obje yada undefined

    // if there is no order in order book
    if (!bestPrice) {
      return false;
    } else {
      if (
        (order.side === "BUY" && order.price > bestPrice.price) ||
        (order.side === "SELL" && order.price < bestPrice.price)
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  private checkBalance = async (order: OrderParams): Promise<boolean> => {
    const [baseSymbol, quoteSymbol] = order.symbolPair.split("/"); // ABC/USD => ABC

    if (order.side === "BUY") {
      // check usd balance
      const response = await this.shareRepository.findJoin({
        symbol: quoteSymbol,
        userId: order.userId,
      });

      if (!response) return false;

      const { portfolios } = response;

      let { quantity, lockedQuantity } = portfolios[0];

      const freeQuantity = parseFloat(quantity) - parseFloat(lockedQuantity);

      if (order.type === "MARKET") {
        // check if there is enough balance
        if (freeQuantity < order.quantity) {
          return false;
        }
      } else if (order.type === "LIMIT") {
        // check if there is enough balance
        if (freeQuantity * order.price < order.quantity) {
          return false;
        }
      }
    } else if (order.side === "SELL") {
      // check baseSymbol balabce
      const response = await this.shareRepository.findJoin({
        symbol: baseSymbol,
        userId: order.userId,
      });

      if (!response) return false;

      const { portfolios } = response;

      let { quantity, lockedQuantity } = portfolios[0];

      const freeQuantity = parseFloat(quantity) - parseFloat(lockedQuantity);

      // exp: freeQty = 10, orderQty = 11 => false
      if (freeQuantity < order.quantity) {
        return false;
      }
    }
    return true;
  };

  private lockBalance = async (order: OrderParams) => {
    const [baseSymbol, quoteSymbol] = order.symbolPair.split("/"); // ABC/USD => ABC

    if (order.side === "BUY") {
      // lock quoteSymbol balance ABC/USD => USD
      const { portfolios } = await this.shareRepository.findJoin({
        symbol: quoteSymbol,
        userId: order.userId,
      });

      let portfolio = portfolios[0];

      // lock USD => Quantity * Price
      if (order.type === "LIMIT") {
        portfolio.lockedQuantity =
          parseFloat(portfolio.lockedQuantity) + order.quantity * order.price;
      }
      // lock USD => Quantity
      else if (order.type === "MARKET") {
        portfolio.lockedQuantity =
          parseFloat(portfolio.lockedQuantity) + order.quantity;
      }
      const response = await this.portfolioRepository.update(portfolio);

      if (response === 0) {
        return false;
      } else if (response === 1) {
        return true;
      }
      return false;
    } else if (order.side === "SELL") {
      // lock baseSymbol balance ABC/USD => ABC
      const { portfolios } = await this.shareRepository.findJoin({
        symbol: baseSymbol,
        userId: order.userId,
      });

      let portfolio = portfolios[0];

      // lock ABC => Quantity
      if (order.type === "LIMIT") {
        portfolio.lockedQuantity =
          parseFloat(portfolio.lockedQuantity) + order.quantity;
      }
      // lock ABC => Quantity
      else if (order.type === "MARKET") {
        portfolio.lockedQuantity =
          parseFloat(portfolio.lockedQuantity) + order.quantity;
      }

      const response = await this.portfolioRepository.update(portfolio);

      if (response === 0) {
        return false;
      } else if (response === 1) {
        return true;
      }
      return false;
    }
  };

  private getBestPrice = async (
    side: "BUY" | "SELL",
    symbolPair: string
  ): Promise<OrderParams[]> => {
    try {
      if (side === "BUY") {
        return await this.orderBookRepository.getMinAskPrice(symbolPair);
      } else if (side === "SELL") {
        return await this.orderBookRepository.getMaxBidPrice(symbolPair);
      }
      return [];
    } catch (err) {
      console.log("getBestPrice error");
      return [];
    }
  };

  public retriveById = async (req: Request, res: Response) => {
    try {
      const order = await this.repository.retrieveById(req.params.id);

      if (order) res.send(order);
      else
        res.status(404).send({
          message: `Cannot find Order with id=${req.params.id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving orders.",
      });
    }
  };

  // call portfolio controller
  private saveOrder = async (order: OrderParams) => {
    try {
      // get base and quote share id
      const [baseSymbol, quoteSymbol] = order.symbolPair.split("/"); // ABC/USD => ABC

      const baseShare = await this.shareRepository.findOne({
        symbol: baseSymbol,
      });
      const quoteShare = await this.shareRepository.findOne({
        symbol: quoteSymbol,
      });

      if (!baseShare || !quoteShare) {
        return false;
      }

      // save order
      const savedOrder = await this.repository.save({
        ...order,
        baseSymbolId: baseShare.id,
        quoteSymbolId: quoteShare.id,
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}
