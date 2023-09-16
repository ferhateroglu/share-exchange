export const config = {
  HOST: process.env.HOST,
  USER: process.env["DB-USER"],
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const dialect = "postgres";
