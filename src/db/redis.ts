import { createClient } from "redis";

class RedisDatabase {
  public client;

  constructor() {
    this.client = createClient();

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
  }
}

export default RedisDatabase;
