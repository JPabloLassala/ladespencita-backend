import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import {
  APIGatewayAuthorizerResult,
  APIGatewayProxyResult,
  APIGatewayRequestAuthorizerEvent,
  Callback,
  Context,
  StatementEffect,
} from "aws-lambda";
import { logger, metrics, tracer } from "../Common/powertools";
import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";

// Help function to generate an IAM policy
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect as StatementEffect,
          Resource: resource,
        },
      ],
    },
    context: {
      stringKey: "stringval",
      numberKey: 123,
      booleanKey: true,
    },
  };

  return authResponse;
};

const lambdaHandler = async (
  event: APIGatewayRequestAuthorizerEvent,
  context: Context,
  callback: Callback,
): Promise<APIGatewayProxyResult> => {
  logger.appendKeys({
    resource_path: event.requestContext.resourcePath,
  });

  try {
    const token = event.headers.Authorization;
    switch (token) {
      case "allow":
        callback(null, generatePolicy("user", "Allow", event.methodArn));
        break;
      case "deny":
        callback(null, generatePolicy("user", "Deny", event.methodArn));
        break;
      case "unauthorized":
        callback("Unauthorized"); // Return a 401 Unauthorized response
        break;
      default:
        callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
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
