import { Sequelize } from 'sequelize';

import { CommonConfig } from '../common/common.config';

export const sequelize: Sequelize = new Sequelize(CommonConfig.DB_CONNECTION_STRING);
