import path from 'path';
import { DataSource } from 'typeorm';

import { ENV } from './env';

export const initialize = async () =>
  new DataSource({
    name: 'default',
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    database: ENV.MYSQL_DATABASE,
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,
    logging: ENV.NODE_ENV !== 'production', // logging sql queries except in production.
    synchronize: ENV.NODE_ENV === 'development', // synchronize entities except in development.
    entities: [path.join(__dirname, '../entities/mysql/*.*')],
  }).initialize();
