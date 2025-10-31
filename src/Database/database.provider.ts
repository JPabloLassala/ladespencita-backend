import mongoose from "mongoose";
import { env } from "process";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(env.MONGO_URL),
  },
];
