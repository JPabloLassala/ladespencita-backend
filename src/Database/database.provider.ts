import mongoose from "mongoose";
import { env } from "process";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: (): Promise<typeof mongoose> => {
      console.log(`Mongo debug is ${env.MONGO_DEBUG}`);
      mongoose.set("debug", Boolean(env.MONGO_DEBUG));
      return mongoose.connect(
        env.MONGO_URL || "mongodb://root:example@db:27017/nest?authSource=admin",
      );
    },
  },
];
