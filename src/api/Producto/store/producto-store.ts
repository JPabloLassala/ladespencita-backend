import { Producto } from "../model";

export interface ProductoStore {
  getProducto: (id: string) => Promise<Producto | undefined>;
  putProducto: (producto: Producto) => Promise<void>;
  deleteProducto: (id: string) => Promise<void>;
  getProductos: () => Promise<Producto[] | undefined>;
}
