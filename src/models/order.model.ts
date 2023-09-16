import { Model, Table, Column, DataType } from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";

@Table({
  tableName: "orders",
})
export default class Order extends BaseEntity {
  @Column({
    type: DataType.UUID,
    field: "userId",
    allowNull: false,
  })
  userId?: string;
  @Column({
    type: DataType.UUID,
    field: "baseSymbolId",
    allowNull: false,
  })
  baseSymbolId?: string;
  @Column({
    type: DataType.UUID,
    field: "quoteSymbolId",
    allowNull: false,
  })
  quoteSymbolId?: string;
  @Column({
    type: DataType.INTEGER,
    field: "quantity",
    allowNull: false,
  })
  quantity?: number;
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: "price",
    defaultValue: null,
    allowNull: true,
  })
  price?: number;
  @Column({
    type: DataType.ENUM("BUY", "SELL"),
    field: "side",
    allowNull: false,
  })
  side?: string;
  @Column({
    type: DataType.ENUM("MARKET", "LIMIT"),
    field: "type",
    allowNull: false,
  })
  type?: string;
  @Column({
    type: DataType.ENUM("PENDING", "COMPLETED"),
    field: "status",
    allowNull: false,
  })
  status?: string;
}
