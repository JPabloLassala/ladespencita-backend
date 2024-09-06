import { captureAWSv3Client } from "aws-xray-sdk-core";
import { ProductoStore } from "../../Producto/store";
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Producto } from "../../Producto/model";
import { tracer } from "../powertools";
import {
  fromProductoToSchema,
  fromSchemaToDynamoDbCommand,
  fromSchemaToProducto,
  ProductoSchema,
} from "../../Producto/schema";

export class DynamoDbStore implements ProductoStore {
  private static tableName = process.env.TABLE_NAME;
  private static ddbClient: DynamoDBClient = captureAWSv3Client(new DynamoDBClient({}));
  private static ddbDocClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
    DynamoDbStore.ddbClient,
  );

  @tracer.captureMethod()
  public async getProducto(id: string): Promise<Producto | undefined> {
    const params: GetCommand = new GetCommand({
      TableName: DynamoDbStore.tableName,
      Key: {
        id: id,
      },
    });
    const result: GetCommandOutput = await DynamoDbStore.ddbDocClient.send(params);
    return fromSchemaToProducto(result.Item as ProductoSchema);
  }

  @tracer.captureMethod()
  public async putProducto(producto: Producto): Promise<void> {
    const params: PutCommand = new PutCommand({
      TableName: DynamoDbStore.tableName,
      Item: {
        ...fromProductoToSchema(producto),
      },
    });
    await DynamoDbStore.ddbDocClient.send(params);
  }

  @tracer.captureMethod()
  public async deleteProducto(id: string): Promise<void> {
    const params: DeleteCommand = new DeleteCommand({
      TableName: DynamoDbStore.tableName,
      Key: {
        id: id,
      },
    });
    await DynamoDbStore.ddbDocClient.send(params);
  }

  @tracer.captureMethod()
  public async getProductos(): Promise<Producto[] | undefined> {
    const params: ScanCommand = new ScanCommand({
      TableName: DynamoDbStore.tableName,
      Limit: 20,
    });
    const result = await DynamoDbStore.ddbDocClient.send(params);
    return (result.Items as ProductoSchema[]).map(fromSchemaToProducto);
  }

  @tracer.captureMethod()
  public async putProductoBulk(productos: ProductoSchema[]): Promise<BatchWriteItemCommandOutput> {
    console.log("producto schemas: ", productos);
    const TableName = "Productos";
    const productosCommands = productos.map(fromSchemaToDynamoDbCommand);
    const params: BatchWriteItemCommand = new BatchWriteItemCommand({
      RequestItems: { [TableName]: productosCommands },
    });
    return await DynamoDbStore.ddbClient.send(params);
  }
}
