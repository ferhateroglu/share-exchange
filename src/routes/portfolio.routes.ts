import { Router } from "express";
import PortfolioController from "../controllers/portfolio.controller";
import ValidationMiddleware from "../middlewares/validaiton.middleware"; // Import the middleware class
import { portfolioSchema } from "../validations"; // Import the schemas

class PortfolioRouter {
  public router = Router();
  private controller: PortfolioController;
  private validationMiddleware: ValidationMiddleware; // Pass the schema to the middleware

  constructor() {
    this.controller = new PortfolioController();
    this.validationMiddleware = new ValidationMiddleware(portfolioSchema); // Pass the schema to the middleware
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/bulk/:id",
      this.validationMiddleware.validateParams("id"),
      this.validationMiddleware.validateBody("bulk"),
      this.controller.bulkCreate
    );
    this.router.post(
      "/deposit/:id",
      this.validationMiddleware.validateParams("id"),
      this.validationMiddleware.validateBody("deposit"),
      this.controller.deposit
    );
    this.router.get("/:id", this.controller.retriveAll);
    this.router.post(
      "/:id",
      this.validationMiddleware.validateBody("addPortfolio"),
      this.controller.addPortfolio
    );
    this.router.put(
      "/:id",
      this.validationMiddleware.validateBody("updatePortfolio"),
      this.controller.updatePortfolio
    );
    this.router.delete(
      "/:id",
      this.validationMiddleware.validateParams("id"),
      this.controller.removePortfolio
    );
  }
}

export default new PortfolioRouter().router;
