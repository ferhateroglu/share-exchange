import { Op } from "sequelize";
import { Request, Response } from "express";
import { User } from "../models";
import { UserRepository } from "../repositories";

export default class UserController {
  async create(req: Request, res: Response) {
    try {
      const user: User = req.body;

      const savedUser = await UserRepository.save(user);

      res.status(201).send(savedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async saveAll(req: Request, res: Response) {
    try {
      const users: User[] = req.body.users;

      const savedUsers = await UserRepository.saveAll(users);

      res.status(201).send(savedUsers);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async retriveById(req: Request, res: Response) {
    try {
      const user = await UserRepository.retrieveById(req.params.id);

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
  }

  async retriveByEmail(req: Request, res: Response) {
    try {
      const user = await UserRepository.retriveByEmail(req.params.email);

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
  }

  async retriveAll(req: Request, res: Response) {
    try {
      const users = await UserRepository.retriveAll();

      res.send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user: User = req.body;
      user.id = req.params.id;

      const updatedUser = await UserRepository.update(user);

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
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedUser = await UserRepository.delete(req.params.id);

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
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const deletedUsers = await UserRepository.deleteAll();

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
  }
}
