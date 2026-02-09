export type OdsJpegRecord = {
  name?: string;
  path: string; // e.g. "Pictures/foo.jpeg"
  buffer: Buffer; // binary JPEG data
  anchoredToCell: boolean; // true if inside a cell
  cell?: { row: number; col: number; addr: string };
  abs?: { x?: string; y?: string; width?: string; height?: string };
};
