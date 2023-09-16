import { symbol } from "joi";
import { Portfolio, Share } from "../models";

interface error {
  message: string;
}

interface IPortfolioRepository {
  save(portfolio: Portfolio): Promise<Portfolio | error>;
  findOne(params: {
    userId?: string;
    shareId?: string;
    symbol?: string;
  }): Promise<Portfolio | null>;
  findOrCreate(portfolio: Portfolio): Promise<[Portfolio, boolean]>;
  saveAll(portfolios: any): Promise<Portfolio[] | error>;
  retriveAll(): Promise<Portfolio[]>;
  update(portfolio: Portfolio): Promise<number | error>;
  remove(portfolioId: string): Promise<number | error>;
}

class PortfolioRepository implements IPortfolioRepository {
  async save(portfolio: Portfolio): Promise<Portfolio | error> {
    try {
      return await Portfolio.create({ ...portfolio });
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to create Portfolio!");
    }
  }

  async findOne(params: {
    userId?: string;
    shareId?: string;
  }): Promise<any | null> {
    try {
      const response = await Portfolio.findOne({
        where: { ...params },
        include: [
          {
            model: Share,
          },
        ],
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve Portfolio!");
    }
  }

  async findOrCreate(portfolio: Portfolio): Promise<[Portfolio, boolean]> {
    try {
      return await Portfolio.findOrCreate({
        where: {
          userId: portfolio.userId,
          shareId: portfolio.shareId,
        },
        defaults: {
          quantity: portfolio.quantity,
          lockedQuantity: portfolio.lockedQuantity,
        },
      });
    } catch (error) {
      throw new Error("Failed to retrieve Portfolio!");
    }
  }

  async saveAll(portfolios: any): Promise<Portfolio[] | error> {
    try {
      console.log(portfolios);
      return await Portfolio.bulkCreate(portfolios);
    } catch (err: any) {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to create Portfolio!");
    }
  }

  async retriveAll(): Promise<Portfolio[]> {
    try {
      return await Portfolio.findAll();
    } catch (error) {
      throw new Error("Failed to retrieve Portfolio!");
    }
  }

  async update(portfolio: Portfolio): Promise<number | error> {
    try {
      const affectedRows = await Portfolio.update(
        {
          quantity: portfolio.quantity,
          lockedQuantity: portfolio.lockedQuantity,
        },
        { where: { id: portfolio.id } }
      );
      return affectedRows[0];
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to update Portfolio!");
    }
  }

  async remove(portfolioId: string): Promise<number | error> {
    try {
      const affectedRows = await Portfolio.update(
        { deletedAt: new Date() },
        { where: { id: portfolioId } }
      );
      return affectedRows[0];
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to update Portfolio!");
    }
  }
}

export default PortfolioRepository;
