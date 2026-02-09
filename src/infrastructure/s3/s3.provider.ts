import { S3Client } from "@aws-sdk/client-s3";
import { Provider } from "@nestjs/common";
import { S3 } from "src/common/constants";

export const s3Provider: Provider = {
  provide: S3,
  useFactory: () => {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    return s3;
  },
};
