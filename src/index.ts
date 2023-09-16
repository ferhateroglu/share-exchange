import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";
import Database from "./db";
import RedisDB from "./db/inMemory.db";

export default class Server {
  private redisDB = new RedisDB();

  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    this.connectRedis();
    new Routes(app, this.redisDB.client);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:" + (process.env.PORT || 8080),
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new Database();
    db.sequelize?.sync();
  }

  private async connectRedis(): Promise<void> {
    try {
      await this.redisDB.connect();
    } catch (error) {
      console.log("some error occurred while connecting to redis");
    }
  }
}
