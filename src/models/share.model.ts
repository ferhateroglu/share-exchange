import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseEntity from "./baseEntity.model";
import Portfolio from "./portfolio.model";

@Table({
  tableName: "shares",
})
export default class Share extends BaseEntity {
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

  @HasMany(() => Portfolio)
  portfolios!: Portfolio[];
}
