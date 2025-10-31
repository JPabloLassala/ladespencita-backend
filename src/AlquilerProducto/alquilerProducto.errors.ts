export class HigherThanStockError extends Error {
  public alquilerProductosStock: [number, any][];

  constructor(public readonly aps: [number, any][]) {
    super(`La cantidad de los siguientes productos supera el stock`);

    this.alquilerProductosStock = aps;
  }
}
