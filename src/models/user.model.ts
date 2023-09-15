import { Model, Table, Column, DataType } from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";

@Table({
  tableName: "users",
})
export default class User extends BaseEntity {
  @Column({
    type: DataType.STRING(255),
    field: "email",
    unique: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING(255),
    field: "password",
  })
  password?: string;
}
