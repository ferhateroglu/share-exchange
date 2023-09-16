import { Request, Response } from "express";
import { Portfolio, Order } from "../models";
import { PortfolioRepository } from "../repositories";

export default class UserController {
  private repository: PortfolioRepository;

  constructor() {
    this.repository = new PortfolioRepository();
  }

  public deposit = async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.id;
      const quantity: number = req.body.quantity;

      const portfolio = await this.repository.findOne({
        userId,
        symbol: "USD",
      });

      return portfolio;

      // if (portfolio) {
      //   portfolio.quantity += quantity;
      //   const updatedPortfolio = await this.repository.update(portfolio);

      //   if (updatedPortfolio === 0) {
      //     res.status(404).send({
      //       message: "Portfolio not found!",
      //     });
      //   } else if (updatedPortfolio === 1) {
      //     res.status(201).send({ message: "Portfolio updated successfully!" });
      //   }
      // }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public bulkCreate = async (req: Request, res: Response) => {
    try {
      const portfolios: Portfolio[] = req.body.portfolios;
      portfolios.forEach((portfolio) => {
        portfolio.userId = req.params.id;
      });
      console.log(portfolios);

      const savedPortfolios = await this.repository.saveAll(portfolios);

      res.status(201).send(savedPortfolios);
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
