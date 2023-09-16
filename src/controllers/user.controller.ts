import { Op } from "sequelize";
import { Request, Response } from "express";
import { User } from "../models";
import { UserRepository } from "../repositories";

export default class UserController {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const user: User = req.body;

      const savedUser = await this.repository.save(user);

      res.status(201).send(savedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public saveAll = async (req: Request, res: Response) => {
    try {
      const users: User[] = req.body.users;

      const savedUsers = await this.repository.saveAll(users);

      res.status(201).send(savedUsers);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public retriveById = async (req: Request, res: Response) => {
    try {
      const user = await this.repository.retrieveById(req.params.id);

      if (user) res.send(user);
      else
        res.status(404).send({
          message: `Cannot find User with id=${req.params.id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public retriveByEmail = async (req: Request, res: Response) => {
    try {
      const user = await this.repository.retriveByEmail(req.params.email);

      if (user) res.send(user);
      else
        res.status(404).send({
          message: `Cannot find User with email=${req.params.email}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public retriveAll = async (req: Request, res: Response) => {
    try {
      const users = await this.repository.retriveAll();

      res.send(users);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const user: User = req.body;
      user.id = req.params.id;

      const updatedUser = await this.repository.update(user);

      if (updatedUser == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.status(404).send({ message: "User was not found" });
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const deletedUser = await this.repository.delete(req.params.id);

      if (deletedUser == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.status(404).send({ message: "User was not found" });
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };

  public deleteAll = async (req: Request, res: Response) => {
    try {
      const deletedUsers = await this.repository.deleteAll();

      if (deletedUsers > 0) {
        res.send({
          message: `${deletedUsers} User were deleted successfully!`,
        });
      } else {
        res.status(404).send({ message: "Users were not found" });
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  };
}
