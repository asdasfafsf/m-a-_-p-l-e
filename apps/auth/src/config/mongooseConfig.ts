import { registerAs } from '@nestjs/config';

export const MongooseConfig = registerAs('mongoose', () => ({
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME,
}));
