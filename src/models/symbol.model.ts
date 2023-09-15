import { Table, Column, DataType } from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";

@Table({
  tableName: "symbols",
})
export default class Symbol extends BaseEntity {
  @Column({
    type: DataType.STRING(3),
    field: "symbol",
    unique: true,
  })
  symbol?: string;
  @Column({
    type: DataType.STRING(255),
    field: "name",
  })
  name?: string;
}
