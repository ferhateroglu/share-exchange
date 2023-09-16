import { Router } from "express";
import Share from "../controllers/share.controller";
import ValidationMiddleware from "../middlewares/validaiton.middleware"; // Import the middleware class
import { shareSchema } from "../validations"; // Import the schemas

class ShareRouter {
  router = Router();
  controller = new Share();
  validationMiddleware = new ValidationMiddleware(shareSchema); // Pass the schema to the middleware
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get("/", this.controller.retriveAll);
    this.router.post(
      "/bulk",
      this.validationMiddleware.validateBody("bulk"),
      this.controller.bulkCreate
    );
  }
}

export default new ShareRouter().router;
