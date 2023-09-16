import { Router } from "express";
import OrderController from "../controllers/order.controller";
import ValidationMiddleware from "../middlewares/validaiton.middleware"; // Import the middleware class
import { orderSchema } from "../validations"; // Import the schemas
import { RedisClientType } from "../db/inMemory.db";

class OrderRouter {
  public router: Router;
  private controller: OrderController;
  private validationMiddleware: ValidationMiddleware;

  constructor(redisClient: RedisClientType) {
    this.router = Router();
    this.controller = new OrderController(redisClient);
    this.validationMiddleware = new ValidationMiddleware(orderSchema); // Pass the schema to the middleware
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      "/",
      this.validationMiddleware.validateBody("create"),
      this.controller.create
    );
  }
}

export default OrderRouter;
