import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createNestTypeOrmOptions } from "./database.config";

export const DatabaseModule: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }
    return createNestTypeOrmOptions(databaseUrl);
  },
});
