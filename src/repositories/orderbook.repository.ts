import RedisDB, { RedisClientType } from "../db/inMemory.db";
import { Order } from "../models";

interface OrderParams extends Order {
  time?: number;
  symbolPair: string;
}

interface IOrderBookRepository {
  setByScore(orders: OrderParams): Promise<any>;
  getMaxBidPrice(symbolPair: string): Promise<any>;
  getMinAskPrice(symbolPair: string): Promise<any>;
  getByScore(key: string, score: number): Promise<OrderParams>;
}

export default class OrderBookRepository implements IOrderBookRepository {
  private redisClient: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  public async setByScore(order: OrderParams): Promise<any> {
    try {
      const key = order.symbolPair + "-" + order.side;

      return await this.redisClient.zAdd(key, {
        score: order.price,
        value: JSON.stringify(order),
      });
    } catch (err) {
      console.log("hata");
      return false;
    }
  }

  public async removeByOrder(order: any): Promise<any> {
    try {
      order = JSON.parse(order);
      const key = order.symbolPair + "-" + order.side;
      return await this.redisClient.zRem(key, JSON.stringify(order));
    } catch (err) {
      console.log("hata");
      return false;
    }
  }

  public async getByScore(key: string, score: number): Promise<any> {
    try {
      let order = await this.redisClient.zRangeByScore(key, score, score);
      return order;
    } catch (err) {
      console.log("hata");
      return [];
    }
  }

  public async getMaxBidPrice(symbolPair: string): Promise<any> {
    try {
      const key = symbolPair + "-BUY";
      const response = await this.redisClient.zRange(key, -1, -1);
      return response;
    } catch (err) {
      console.log("hata");
      return false;
    }
  }

  public async getMinAskPrice(symbolPair: string): Promise<any> {
    try {
      const key = symbolPair + "-SELL";
      const response = await this.redisClient.zRange(key, 0, 0);
      return response;
    } catch (err) {
      console.log("hata");
      return false;
    }
  }
}
