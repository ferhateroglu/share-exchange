import { Op } from "sequelize";
import { Request, Response } from "express";
import { Share } from "../models";
import { ShareRepository } from "../repositories";

export default class UserController {
  private repository: ShareRepository;

  constructor() {
    this.repository = new ShareRepository();
  }

  public bulkCreate = async (req: Request, res: Response) => {
    try {
      const shares: Share[] = req.body.shares;

      const savedShares = await this.repository.saveAll(shares);

      res.status(201).send(savedShares);
    } catch (err) {
      console.log(err);

      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public retriveAll = async (req: Request, res: Response) => {
    try {
      const shares = await this.repository.retriveAll();
      res.send(shares);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };
}
