import { productos } from "./data/productos";
import { DynamoDB } from "aws-sdk";

export async function seed_Products() {
  const tableName = "Productos";
  const dynamoDb = new DynamoDB.DocumentClient({
    region: "sa-east-1",
  });
  console.log(JSON.stringify(productos[0]));
  const items = [...productos];
  const requests = items.map((item) => {
    return { PutRequest: { Item: item } };
  });
  const chunks = chunkArray(requests, 25);
  chunks.forEach((chunk) => {
    dynamoDb
      .batchWrite({ RequestItems: { [tableName]: chunk } })
      .promise()
      .then(() => {
        console.log("Items written successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  });

  console.log("Productos insertados");
}

function chunkArray(myArray, chunk_size) {
  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }
  return results;
}
