import { Model, Table, Column, DataType } from "sequelize-typescript";

export default class BaseEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    field: "id",
  })
  id?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "createdAt",
  })
  createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "updatedAt",
  })
  updatedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
    field: "deletedAt",
  })
  deletedAt?: Date;
}
