export interface Image {
  id: number;
  url: string;
  productoId: number;
  isMain: boolean;
  createdAt: Date;
}

export interface ImageCreate {
  name: string;
  mimetype: string;
  data: string;
}
