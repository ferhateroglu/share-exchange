import { Sequelize } from "sequelize-typescript";
import { config, dialect } from "../config/db.config";
import { Order, Portfolio, Share, User } from "../models";

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
      models: [Order, Portfolio, Share, User],
      logging: false,
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Sequelize connected");
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err);
      });
  }
}

export default Database;
