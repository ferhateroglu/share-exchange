import { Order } from "../models";

interface error {
  message: string;
}

interface IOrderRepository {
  save(order: Order): Promise<Order | error>;
  retrieveById(id: string): Promise<Order | null>;
  update(order: Order): Promise<number>;
}

class OrderRepository implements IOrderRepository {
  async save(order: Order): Promise<Order | error> {
    try {
      return await Order.create({ ...order });
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return { message: "Duplicate entry found!" };
      }
      throw new Error("Failed to create Order!");
    }
  }

  async retrieveById(id: string): Promise<Order | null> {
    try {
      return await Order.findOne({
        where: { id: id, deletedAt: null },
      });
    } catch (error) {
      throw new Error("Failed to retrieve Order!");
    }
  }

  async update(order: Order): Promise<number> {
    try {
      const affectedRows = await Order.update(order, {
        where: { id: order.id },
      });
      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Order!");
    }
  }
}

export default OrderRepository;
