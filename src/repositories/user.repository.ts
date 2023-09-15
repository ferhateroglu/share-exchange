import { Op, Optional } from "sequelize";
import { User } from "../models";

interface IUserRepository {
  save(user: User): Promise<User>;
  saveAll(users: any): Promise<User[]>;
  retrieveById(tutorialId: string): Promise<User | null>;
  retriveByEmail(email: string): Promise<User | null>;
  retriveAll(): Promise<User[]>;
  update(tutorial: User): Promise<number>;
  delete(tutorialId: string): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    try {
      return await User.create({
        email: user.email,
        password: user.password,
      });
    } catch (err) {
      throw new Error("Failed to create User!");
    }
  }

  async saveAll(users: any): Promise<User[]> {
    try {
      return await User.bulkCreate(users);
    } catch (err) {
      throw new Error("Failed to create User!");
    }
  }

  async retrieveById(userId: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { id: userId, deletedAt: null },
      });
    } catch (error) {
      throw new Error("Failed to retrieve User!");
    }
  }

  async retriveByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email: email, deletedAt: null } });
    } catch (error) {
      throw new Error("Failed to retrieve User!");
    }
  }

  async retriveAll(): Promise<User[]> {
    try {
      return await User.findAll({ where: { deletedAt: null } });
    } catch (error) {
      throw new Error("Failed to retrieve User!");
    }
  }

  async update(user: User): Promise<number> {
    const { id, email, password } = user;

    try {
      const affectedRows = await User.update(
        { email, password },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update User!");
    }
  }

  async delete(userId: string): Promise<number> {
    // soft delete
    try {
      const affectedRows = await User.update(
        { deletedAt: new Date() },
        { where: { id: userId } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to delete User!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      // Update the deletedAt column with the current timestamp
      const [affectedRows] = await User.update(
        { deletedAt: new Date() },
        { where: {} }
      );

      return affectedRows || 0;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to soft delete User!");
    }
  }
}

export default new UserRepository();
