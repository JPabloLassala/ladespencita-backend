import { S3Client } from "@aws-sdk/client-s3";
import { Provider } from "@nestjs/common";
import { S3 } from "src/constants";

export const s3Provider: Provider = {
  provide: S3,
  useFactory: () => {
    const s3 = new S3Client({
      endpoint: "https://s3.us-west-004.backblazeb2.com",
      region: "s3.us-west-004",
      credentials: {
        accessKeyId: process.env.BACKBLAZE_KEY_ID,
        secretAccessKey: process.env.BACKBLAZE_KEY,
      },
      forcePathStyle: true,
    });

    return s3;
  },
};
