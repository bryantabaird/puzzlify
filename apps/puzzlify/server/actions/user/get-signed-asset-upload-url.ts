"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({ region: "us-west-2" });
const BUCKET_NAME = "adventure-app-stage-images";

export const getSignedAssetUploadUrl = async () => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: randomUUID(),
    ContentType: "application/octet-stream",
  };

  try {
    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return { assetUploadUrl: presignedUrl };
  } catch (error) {
    console.error("Error generating presigned URL", error);
    throw new Error("Error generating presigned URL");
  }
};
