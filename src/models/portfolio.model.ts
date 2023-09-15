import { Model, Table, Column, DataType } from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";

@Table({
  tableName: "portfolios",
})
export default class Portfolio extends BaseEntity {
  @Column({
    type: DataType.UUID,
    field: "userId",
    allowNull: false,
  })
  userId?: string;
  @Column({
    type: DataType.UUID,
    field: "symbolId",
    allowNull: false,
  })
  symbolId?: string;
  @Column({
    type: DataType.INTEGER,
    field: "quantity",
    allowNull: false,
  })
  quantity?: number;
  @Column({
    type: DataType.INTEGER,
    field: "lockedQuantity",
    allowNull: false,
  })
  lockedQuantity?: number;
}
