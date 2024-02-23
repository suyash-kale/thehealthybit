import path from 'path';
import { DataSource } from 'typeorm';

import { ENV } from './env';

export const initialize = async () => {
  const logging = ENV.NODE_ENV === 'development'; // logging sql queries except in production.

  await new DataSource({
    name: 'default',
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    database: ENV.MYSQL_DATABASE,
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,
    logging,
    entities: [path.join(__dirname, '../entities/mysql/*.*')],
  }).initialize();

  await new DataSource({
    type: 'mongodb',
    url: ENV.MONGODB_URL,
    database: 'alpha-the-healthy-bit',
    logging,
    entities: [path.join(__dirname, '../entities/mongodb/*.*')],
  }).initialize();
};
