import { Router } from "express";
import PortfolioController from "../controllers/portfolio.controller";
import ValidationMiddleware from "../middlewares/validaiton.middleware"; // Import the middleware class
import { portfolioSchema } from "../validations"; // Import the schemas

class PortfolioRouter {
  router = Router();
  controller = new PortfolioController();
  validationMiddleware = new ValidationMiddleware(portfolioSchema); // Pass the schema to the middleware
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      "/saveAll",
      this.validationMiddleware.validateBody("saveAll"),
      this.controller.saveAll
    );
    this.router.get("/", this.controller.retriveAll);
    this.router.post(
      "/",
      this.validationMiddleware.validateBody("addPortfolio"),
      this.controller.addPortfolio
    );
    this.router.put(
      "/",
      this.validationMiddleware.validateBody("updatePortfolio"),
      this.controller.updatePortfolio
    );
    this.router.delete(
      "/:id",
      this.validationMiddleware.validateParams("removePortfolio"),
      this.controller.removePortfolio
    );
  }
}
