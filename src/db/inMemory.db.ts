import { createClient } from "redis";
import { redisConfig } from "../config/db.config";

export type RedisClientType = ReturnType<typeof createClient>;

class RedisDatabase {
  public client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: redisConfig.host || "localhost",
        port: Number(redisConfig.port) || 6379,
      },
    });

    // listeners
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
    this.client.on("connect", () => {
      console.log("Redis Client Connected");
    });
  }

  public async connect() {
    await this.client.connect();
    return this.client;
  }
}

export default RedisDatabase;
