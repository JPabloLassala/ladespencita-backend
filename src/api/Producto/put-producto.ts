import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbStore } from "../Common/dynamodb";
import { ProductoStore } from "./store";
import { logger, metrics, tracer } from "../Common/powertools";
import { Producto } from "./model";
import { MetricUnit } from "@aws-lambda-powertools/metrics";
import middy from "@middy/core";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";

const store: ProductoStore = new DynamoDbStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({
    resource_path: event.requestContext.resourcePath,
  });

  const id = event.pathParameters!.id;
  if (id === undefined) {
    logger.warn("Missing 'id' parameter in path while trying to create a product", {
      details: { eventPathParameters: event.pathParameters },
    });

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Missing 'id' parameter in path" }),
    };
  }

  if (!event.body) {
    logger.warn("Empty request body provided while trying to create a product");

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Empty request body" }),
    };
  }

  let producto: Producto;
  try {
    producto = JSON.parse(event.body);

    if (typeof producto !== "object") {
      throw Error("Parsed product is not an object");
    }
  } catch (error) {
    logger.error("Unexpected error occurred while trying to create a product", error);

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Failed to parse product from request body",
      }),
    };
  }

  if (id !== producto.id) {
    logger.error(`Product ID in path ${id} does not match product ID in body ${producto.id}`);

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Product ID in path does not match product ID in body",
      }),
    };
  }

  try {
    await store.putProducto(producto);

    metrics.addMetric("productCreated", MetricUnit.Count, 1);
    metrics.addMetadata("productId", id);

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Product created" }),
    };
  } catch (error) {
    logger.error("Unexpected error occurred while trying to create a product", error);

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
