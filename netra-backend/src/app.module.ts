// netra-backend/src/app.module.ts (FIXED)

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Load config globally (This makes ConfigService available everywhere)
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),

    // Connect to MongoDB
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
