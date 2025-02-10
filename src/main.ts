import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./App";
import { AllExceptionsFilter } from "./App/exception.filter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const httpAdapter = app.get(HttpAdapterHost);
  dayjs.extend(utc);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
