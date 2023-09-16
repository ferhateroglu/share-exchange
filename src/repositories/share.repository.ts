import { where } from "sequelize";
import { Share } from "../models";

interface IShareRepository {
  saveAll(shares: any): Promise<Share[] | error>;
  retriveAll(): Promise<Share[]>;
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
}

export default ShareRepository;
