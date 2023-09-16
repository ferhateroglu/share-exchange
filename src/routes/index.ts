import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes";
import shareRoutes from "./share.routes";
import portfolioRoutes from "./portfolio.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/shares", shareRoutes);
    app.use("/api/portfolios", portfolioRoutes);
  }
}
