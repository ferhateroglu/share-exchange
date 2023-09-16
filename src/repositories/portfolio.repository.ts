import { Portfolio } from "../models";

interface error {
  message: string;
}

interface IPortfolioRepository {
  saveAll(portfolios: any): Promise<Portfolio[] | error>;
  retriveAll(): Promise<Portfolio[]>;
  addPortfolio(portfolio: any): Promise<Portfolio | error>;
  updatePortfolio(portfolio: Portfolio): Promise<number | error>;
  removePortfolio(portfolioId: string): Promise<number | error>;
}

class PortfolioRepository implements IPortfolioRepository {
  async saveAll(portfolios: any): Promise<Portfolio[] | error> {
    try {
      return await Portfolio.bulkCreate(portfolios);
    } catch (err: any) {
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

  async addPortfolio(portfolio: any): Promise<Portfolio | error> {
    try {
      return await Portfolio.create(portfolio);
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to create Portfolio!");
    }
  }

  async updatePortfolio(portfolio: Portfolio): Promise<number | error> {
    try {
      const affectedRows = await Portfolio.update(portfolio, {
        where: { id: portfolio.id },
      });
      return affectedRows[0];
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to update Portfolio!");
    }
  }

  async removePortfolio(portfolioId: string): Promise<number | error> {
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
