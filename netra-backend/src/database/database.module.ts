// netra-backend/src/database/database.module.ts (FIXED)

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Keep ConfigModule import for typing/inject

@Module({
  imports: [
    // 1. We ONLY use ConfigModule here to define our config structure.
    // We DON'T use forRoot() here because we use it in AppModule.
    ConfigModule,

    // 2. Setup Mongoose connection asynchronously
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // <-- Crucial: Must import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
  ],
  // MongooseModule is the only thing we should export for other feature modules to use.
  exports: [MongooseModule],
})
export class DatabaseModule {}
