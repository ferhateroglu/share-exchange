export const config = {
	HOST: 'localhost',
	USER: 'root',
	PASSWORD: 'test123',
	DB: 'eva-case',
	dialect: 'postgres', // Use 'postgres' dialect for PostgreSQL
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};

export const dialect = 'postgres';
