import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes";
import shareRoutes from "./share.routes";
import portfolioRoutes from "./portfolio.routes";
import OrderRouter from "./order.routes";
import { RedisClientType } from "../db/inMemory.db";

export default class Routes {
  private orderRoutes: any;
  constructor(app: Application, redisClient: RedisClientType) {
    this.orderRoutes = new OrderRouter(redisClient).router;
    app.use("/api", homeRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/shares", shareRoutes);
    app.use("/api/portfolios", portfolioRoutes);
    app.use("/api/orders", this.orderRoutes);
  }
}
