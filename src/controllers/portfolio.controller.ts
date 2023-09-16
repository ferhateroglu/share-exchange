import { Request, Response } from "express";
import { Portfolio } from "../models";
import { PortfolioRepository } from "../repositories";

export default class UserController {
  private repository: PortfolioRepository;

  constructor() {
    this.repository = new PortfolioRepository();
  }

  public saveAll = async (req: Request, res: Response) => {
    try {
      const portfolios: Portfolio[] = req.body.portfolios;

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

      const savedPortfolio = await this.repository.addPortfolio(portfolio);

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

      const savedPortfolio = await this.repository.updatePortfolio(portfolio);

      res.status(201).send(savedPortfolio);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };

  public removePortfolio = async (req: Request, res: Response) => {
    try {
      const portfolioId: string = req.params.id;

      const savedPortfolio = await this.repository.removePortfolio(portfolioId);

      res.status(201).send(savedPortfolio);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving portfolios.",
      });
    }
  };
}
