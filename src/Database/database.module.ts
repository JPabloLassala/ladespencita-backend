import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

export const DatabaseModule: DynamicModule = TypeOrmModule.forRoot({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: false,
  retryAttempts: 3,
  retryDelay: 3000,
});
