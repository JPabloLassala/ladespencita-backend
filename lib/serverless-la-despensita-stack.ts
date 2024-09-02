// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_apigateway, aws_lambda_nodejs, aws_dynamodb, aws_logs, aws_lambda } from "aws-cdk-lib";

export class ServerlessLaDespensitaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productosTable = new aws_dynamodb.Table(this, "Productos", {
      tableName: "Productos",
      partitionKey: {
        name: "id",
        type: aws_dynamodb.AttributeType.STRING,
      },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const envVariables = {
      AWS_ACCOUNT_ID: Stack.of(this).account,
      POWERTOOLS_SERVICE_NAME: "serverless-typescript-demo",
      POWERTOOLS_LOGGER_LOG_LEVEL: "WARN",
      POWERTOOLS_LOGGER_SAMPLE_RATE: "0.01",
      POWERTOOLS_LOGGER_LOG_EVENT: "true",
      POWERTOOLS_METRICS_NAMESPACE: "AwsSamples",
    };

    const esBuildSettings = {
      minify: true,
    };

    const functionSettings = {
      handler: "handler",
      runtime: aws_lambda.Runtime.NODEJS_16_X,
      memorySize: 256,
      environment: {
        TABLE_NAME: productosTable.tableName,
        ...envVariables,
      },
      logRetention: aws_logs.RetentionDays.ONE_WEEK,
      tracing: aws_lambda.Tracing.ACTIVE,
      bundling: esBuildSettings,
    };

    const getProductosFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      "GetProductosFunction",
      {
        awsSdkConnectionReuse: true,
        entry: "./src/api/Producto/get-productos.ts",
        ...functionSettings,
      },
    );

    const getProductFunction = new aws_lambda_nodejs.NodejsFunction(this, "GetProductFunction", {
      awsSdkConnectionReuse: true,
      entry: "./src/api/Producto/get-producto.ts",
      ...functionSettings,
    });

    const putProductFunction = new aws_lambda_nodejs.NodejsFunction(this, "PutProductFunction", {
      awsSdkConnectionReuse: true,
      entry: "./src/api/Producto/put-producto.ts",
      ...functionSettings,
    });

    const deleteProductFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      "DeleteProductosFunction",
      {
        awsSdkConnectionReuse: true,
        entry: "./src/api/Producto/delete-producto.ts",
        ...functionSettings,
      },
    );

    productosTable.grantReadData(getProductosFunction);
    productosTable.grantReadData(getProductFunction);
    productosTable.grantWriteData(deleteProductFunction);
    productosTable.grantWriteData(putProductFunction);

    const api = new aws_apigateway.RestApi(this, "ProductosApi", {
      restApiName: "ProductosApi",
      deployOptions: {
        tracingEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: aws_apigateway.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    });

    const productos = api.root.addResource("productos");
    productos.addMethod("GET", new aws_apigateway.LambdaIntegration(getProductosFunction));

    const producto = productos.addResource("{id}");
    producto.addMethod("GET", new aws_apigateway.LambdaIntegration(getProductFunction));
    producto.addMethod("PUT", new aws_apigateway.LambdaIntegration(putProductFunction));
    producto.addMethod("DELETE", new aws_apigateway.LambdaIntegration(deleteProductFunction));

    new CfnOutput(this, "ApiURL", {
      value: `${api.url}productos`,
    });
  }
}
