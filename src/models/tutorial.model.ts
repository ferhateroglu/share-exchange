import { Model, Table, Column, DataType } from 'sequelize-typescript';
import BaseEntity from './baseEntity.model';

@Table({
	tableName: 'tutorials',
})
export default class Tutorial extends BaseEntity {
	@Column({
		type: DataType.STRING(255),
		field: 'title',
	})
	title?: string;

	@Column({
		type: DataType.STRING(255),
		field: 'description',
	})
	description?: string;

	@Column({
		type: DataType.BOOLEAN,
		field: 'published',
	})
	published?: boolean;
}
