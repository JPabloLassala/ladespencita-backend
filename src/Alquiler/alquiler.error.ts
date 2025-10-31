import { HttpException, HttpStatus } from "@nestjs/common";

export type UsedProductoError = {
  productoId: number;
  used: number;
  stock: number;
  requested: number;
};

export class ProductoHigherThanAvailableError extends HttpException {
  public readonly products: UsedProductoError[];

  constructor(products: UsedProductoError[]) {
    super(
      {
        error: "RequestedHigherThanAvailable",
        products,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.products = products;
    this.name = "ProductoHigherThanAvailableError";
  }
}
