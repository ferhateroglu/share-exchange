import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";
import Share from "./share.model";

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

  @ForeignKey(() => Share) // Define the foreign key relationship
  @Column({
    type: DataType.UUID,
    field: "shareId",
    allowNull: false,
  })
  shareId?: string;

  @BelongsTo(() => Share) // Define the association
  share!: Share; // Create a property to hold the associated Symbol

  @Column({
    type: DataType.DECIMAL(10, 2),
    field: "quantity",
    defaultValue: 0,
    allowNull: false,
  })
  quantity!: number;
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: "lockedQuantity",
    defaultValue: 0,
    allowNull: false,
  })
  lockedQuantity!: number;
}
