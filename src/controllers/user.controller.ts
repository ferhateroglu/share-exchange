import { Request, Response } from "express";
import { User } from "../models";
import { UserRepository } from "../repositories";

export default class UserController {
  async create(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

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
    console.log(req.body);
    if (!req.body.users) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

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
  // retrieveById(tutorialId: number): Promise<User | null>;
  // retriveByEmail(email: string): Promise<User | null>;
  // retriveAll(): Promise<User[]>;
  // update(tutorial: User): Promise<number>;
  // delete(tutorialId: number): Promise<number>;
  // deleteAll(): Promise<number>;

  async retriveById(req: Request, res: Response) {
    try {
      const user = await UserRepository.retrieveById(req.params.id);

      res.send(user);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async retriveByEmail(req: Request, res: Response) {
    try {
      const user = await UserRepository.retriveByEmail(req.params.email);

      res.send(user);
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
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    try {
      const user: User = req.body;

      const updatedUser = await UserRepository.update(user);

      res.send(updatedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedUser = await UserRepository.delete(req.params.id);

      res.send(deletedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const deletedUsers = await UserRepository.deleteAll();

      res.send(deletedUsers);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }
}
