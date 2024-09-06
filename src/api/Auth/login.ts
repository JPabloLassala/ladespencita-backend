import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger, metrics, tracer } from "../Common/powertools";
import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import { sign } from "jsonwebtoken";

const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({
    resource_path: event.requestContext.resourcePath,
  });

  try {
    const { username, password } = JSON.parse(event.body);

    if (username === "asd" && password === "asd") {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          access_token: sign({ username, password }, "secret", {
            expiresIn: "1h",
            algorithm: "HS256",
          }),
        }),
      };
    }
    logger.info("User logged in", { details: { username } });

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "invalid login" }),
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
  .use(httpHeaderNormalizer())
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics, { captureColdStartMetric: true }))
  .use(injectLambdaContext(logger, { clearState: true }));

export { handler };
