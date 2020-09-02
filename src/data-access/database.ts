import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

const result: dotenv.DotenvConfigOutput = dotenv.config();

if (result.error) {
  throw result.error;
}

export const sequelize: Sequelize = new Sequelize(process.env.DB_CONNECTION_STRING as string);
