/* 
  this file is used to config the database with the nestjs 
*/

// netra-backend/src/config/database.config.ts
import { registerAs } from '@nestjs/config';

interface DatabaseConfig {
  uri: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    // Define your MongoDB connection string here.
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/netradb',
  }),
);
