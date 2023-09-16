import { Share, Portfolio } from "../models";

interface IShareRepository {
  saveAll(shares: any): Promise<Share[] | error>;
  retriveAll(): Promise<Share[]>;
  findOne(params: { symbol: string }): Promise<Share | null>;
  findOrCreate(params: {
    name: string;
    symbol: string;
  }): Promise<[Share, boolean]>;
  findJoin(params: { symbol: string; userId: string }): Promise<any>;
}

interface error {
  message: string;
}

class ShareRepository implements IShareRepository {
  async saveAll(shares: any): Promise<Share[] | error> {
    try {
      return await Share.bulkCreate(shares);
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to create Share!");
    }
  }

  async retriveAll(): Promise<Share[]> {
    try {
      return await Share.findAll();
    } catch (error) {
      throw new Error("Failed to retrieve Share!");
    }
  }

  async findOne(params: { symbol: string }): Promise<Share | null> {
    try {
      return await Share.findOne({
        where: {
          symbol: params.symbol,
        },
      });
    } catch (error) {
      throw new Error("Failed to retrieve Share!");
    }
  }

  async findJoin(params: { symbol: string; userId: string }): Promise<any> {
    try {
      return await Share.findOne({
        where: {
          symbol: params.symbol,
        },
        include: [
          {
            model: Portfolio,
            where: { userId: params.userId },
          },
        ],
      });
    } catch (error) {
      throw new Error("Failed to retrieve Share!");
    }
  }

  async findOrCreate(params: {
    name: string;
    symbol: string;
  }): Promise<[Share, boolean]> {
    try {
      return await Share.findOrCreate({
        where: {
          name: params.name,
          symbol: params.symbol,
        },
      });
    } catch (error) {
      throw new Error("Failed to retrieve Share!");
    }
  }
}

export default ShareRepository;
