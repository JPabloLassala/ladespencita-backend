import { MetricUnit } from "@aws-lambda-powertools/metrics";
import middy from "@middy/core";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { DynamoDbStore } from "../api/Common/dynamodb";
import { ProductoStore } from "../api/Producto/store";
import { logger, metrics, tracer } from "../api/Common/powertools";
import { productos } from "../../seeds/data/productos";
import {
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceResponse,
} from "aws-lambda";

const store: ProductoStore = new DynamoDbStore();
const lambdaHandler = async (
  event: CloudFormationCustomResourceEvent,
): Promise<CloudFormationCustomResourceResponse> => {
  try {
    const result = await store.putProductoBulk(productos);

    metrics.addMetric(
      "productCreated",
      MetricUnit.Count,
      result.ItemCollectionMetrics?.["Productos"].length,
    );

    return await crea;
  } catch (error) {
    logger.error("Unexpected error occurred while trying to create a product", error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export { handler };
