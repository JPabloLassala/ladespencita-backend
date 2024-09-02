import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { MetricUnit } from "@aws-lambda-powertools/metrics";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbStore } from "../Common/dynamodb";
import { logger, metrics, tracer } from "../Common/powertools";
import { ProductoStore } from "./store";
import middy from "@middy/core";

const store: ProductoStore = new DynamoDbStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({
    resource_path: event.requestContext.resourcePath,
  });

  try {
    const result = await store.getProductos();

    logger.info("Products retrieved", { details: { products: result } });
    metrics.addMetric("productsRetrieved", MetricUnit.Count, 1);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: `{"productos":${JSON.stringify(result)}}`,
    };
  } catch (error) {
    logger.error("Unexpected error occurred while trying to retrieve products", error as Error);

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export { handler };
