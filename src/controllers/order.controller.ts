import { Request, Response } from "express";
import { Order, User, Portfolio } from "../models";
import {
  OrderRepository,
  UserRepository,
  PortfolioRepository,
} from "../repositories";

import PortfolioController from "./portfolio.controller";

export default class OrderController {
  private repository: OrderRepository;
  private userRepository: UserRepository;
  private portfolioController: PortfolioController;

  constructor() {
    this.repository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.portfolioController = new PortfolioController();
  }

  public create = async (req: Request, res: Response) => {
    try {
      // check

      const order: Order = req.body;
      const savedOrder = this.repository.save(order);
      res.status(201).send(savedOrder);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving orders.",
      });
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
  private addOrder = async (req: Request, res: Response) => {
    try {
      // lock try
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };
}
