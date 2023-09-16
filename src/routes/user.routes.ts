import { Router } from "express";
import UserController from "../controllers/user.controller";
import ValidationMiddleware from "../middlewares/validaiton.middleware"; // Import the middleware class
import { userSchema } from "../validations"; // Import the schemas

class UserRouter {
  public router: Router;
  private controller: UserController;
  private validationMiddleware: ValidationMiddleware;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.validationMiddleware = new ValidationMiddleware(userSchema); // Pass the schema to the middleware
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      "/",
      this.validationMiddleware.validateBody("create"),
      this.controller.create
    );
    this.router.post(
      "/saveAll",
      this.validationMiddleware.validateBody("saveAll"),
      this.controller.saveAll
    );
    this.router.get("/", this.controller.retriveAll);

    this.router.get(
      "/:id",
      this.validationMiddleware.validateParams("retriveById"),
      this.controller.retriveById
    );
    this.router.get(
      "/email/:email",
      this.validationMiddleware.validateParams("retriveByEmail"),
      this.controller.retriveByEmail
    );
    this.router.put(
      "/:id",
      this.validationMiddleware.validateBody("update"),
      this.controller.update
    );
    this.router.delete(
      "/:id",
      this.validationMiddleware.validateParams("delete"),
      this.controller.delete
    );
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new UserRouter().router;
