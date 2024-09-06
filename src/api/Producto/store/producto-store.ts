import { BatchWriteItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { Producto } from "../model";
import { ProductoSchema } from "../schema";

export interface ProductoStore {
  getProducto: (id: string) => Promise<Producto | undefined>;
  putProducto: (producto: Producto) => Promise<void>;
  deleteProducto: (id: string) => Promise<void>;
  getProductos: () => Promise<Producto[] | undefined>;
  putProductoBulk: (productos: ProductoSchema[]) => Promise<BatchWriteItemCommandOutput>;
}
