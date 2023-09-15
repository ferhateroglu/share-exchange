import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRouter {
  router = Router();
  controller = new UserController();
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post("/", this.controller.create);
    this.router.post("/saveAll", this.controller.saveAll);
    this.router.get("/", this.controller.retriveAll);
    this.router.get("/:id", this.controller.retriveById);
    this.router.get("/email/:email", this.controller.retriveByEmail);
    this.router.put("/:id", this.controller.update);
    this.router.delete("/:id", this.controller.delete);
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new UserRouter().router;
