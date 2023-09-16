import { Request, Response } from "express";
import { Portfolio, Order } from "../models";
import {
  PortfolioRepository,
  ShareRepository,
  UserRepository,
} from "../repositories";

export default class UserController {
  private repository: PortfolioRepository;
  private shareRepository: ShareRepository;
  private userRepository: UserRepository;

  constructor() {
    this.repository = new PortfolioRepository();
    this.shareRepository = new ShareRepository();
    this.userRepository = new UserRepository();
  }

  public deposit = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id;
      const quantity: number = req.body.quantity;

      // check user exists
      const user = await this.userRepository.retrieveById(userId);

      if (!user) {
        return res.status(404).send({
          message: "User not found!",
        });
      }

      // find or create USD share
      const [share, created] = await this.shareRepository.findOrCreate({
        name: "US Dollar",
        symbol: "USD",
      });

      // does user have a portfolio for USD?
      const portfolio = await this.repository.findOne({
        userId,
        shareId: share.id,
      });

      if (portfolio) {
        console.log("sen dur");

        portfolio.quantity = parseInt(portfolio.quantity) + quantity;
        const affectedRowCount = await this.repository.update(portfolio);

        if (affectedRowCount === 1) {
          res.status(201).send({ message: "Portfolio updated successfully!" });
        } else {
          res.status(500).send({
            message: "Some error occurred while updation portfolios.",
          });
        }
      } else {
        console.log("sen çalış");

        const portfolio: any = {
          userId,
          shareId: share.id,
          quantity,
        };

        const savedPortfolio = await this.repository.save(portfolio);

        res.status(201).send(savedPortfolio);
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public bulkCreate = async (req: Request, res: Response) => {
    try {
      // check user exists
      const user = await this.userRepository.retrieveById(req.params.id);

      if (!user) {
        return res.status(404).send({
          message: "User not found!",
        });
      }

      const portfolios: Portfolio[] = req.body.portfolios;

      const messageArray: any = [];

      const promiseArray = portfolios.map(async (portfolio) => {
        portfolio.userId = req.params.id;
        const [createdPortfoli, isCreated] = await this.repository.findOrCreate(
          portfolio
        );

        if (isCreated) {
          messageArray.push({
            message: "Portfolio created successfully!",
            portfolio: createdPortfoli,
          });
        } else {
          messageArray.push({
            message: "Portfolio already exists!",
            portfolio: createdPortfoli,
          });
        }
      });

      await Promise.all(promiseArray);

      res.status(201).send(messageArray);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public retriveAll = async (req: Request, res: Response) => {
    try {
      const portfolios = await this.repository.retriveAll();

      if (portfolios) res.send(portfolios);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public addPortfolio = async (req: Request, res: Response) => {
    try {
      const portfolio: Portfolio = req.body;

      const savedPortfolio = await this.repository.save(portfolio);

      res.status(201).send(savedPortfolio);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public updatePortfolio = async (req: Request, res: Response) => {
    try {
      const portfolio: Portfolio = req.body;
      portfolio.id = req.params.id;

      const savedPortfolio = await this.repository.update(portfolio);

      if (savedPortfolio === 0) {
        res.status(404).send({
          message: "Portfolio not found!",
        });
      } else if (savedPortfolio === 1) {
        res.status(201).send({ message: "Portfolio updated successfully!" });
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public removePortfolio = async (req: Request, res: Response) => {
    try {
      const portfolioId: string = req.params.id;

      const savedPortfolio = await this.repository.remove(portfolioId);

      res.status(201).send(savedPortfolio);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public lockPortfolio = async (
    userId: string,
    shareId: string,
    qty: number
  ) => {
    try {
      const portfolio = await this.repository.findOne({ userId, shareId });

      if (portfolio) {
        const freeQty = portfolio.quantity - portfolio.lockedQuantity;
        if (freeQty < qty) {
          return { message: "Not enough shares to lock!" };
        }

        portfolio.lockedQuantity += qty;
        const updatedPortfolio = await this.repository.update(portfolio);

        if (updatedPortfolio === 0) {
          return { message: "Portfolio not found!" };
        } else if (updatedPortfolio === 1) {
          return { message: "Portfolio updated successfully!" };
        }
      }
    } catch (err) {
      return { message: "Some error occurred while locking" };
    }
  };

  public updatePortfolioOnMatch = async (req: Request, res: Response) => {};
}
