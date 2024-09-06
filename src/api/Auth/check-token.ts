import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  StatementEffect,
} from "aws-lambda";
import { logger } from "../Common/powertools";
import middy from "@middy/core";
import { JwtPayload, verify } from "jsonwebtoken";

// Help function to generate an IAM policy
function generatePolicy(
  principalId: string,
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult {
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
}

const lambdaHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken.split(" ")[1];
    console.log("Token extracted");
    const decoded = verify(token, "secret", { algorithms: ["HS256"] }) as JwtPayload;
    console.log("Token decoded");
    const policy = generatePolicy(decoded.username, "Allow", event.methodArn);
    console.log("Policy generated");

    logger.info("User authenticated", { details: { username: decoded.username } });
    console.log("User authenticated");

    console.log("Callback executed");

    return policy;
  } catch (error) {
    logger.error("Unexpected error occurred while trying to retrieve products", error as Error);
    const policy = generatePolicy("user", "Deny", event.methodArn);

    return policy;
  }
};

const handler = middy(lambdaHandler).use(injectLambdaContext(logger, { clearState: true }));

export { handler };
