"use server";

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Adventure, Stage } from "@prisma/client";

const s3 = new S3Client({ region: "us-west-2" });
const BUCKET_NAME = "adventure-app-stage-images";

export const getSignedAssetUploadUrl = async ({
  adventureId,
  stageId,
  contentType,
  assetId,
}: {
  adventureId: Adventure["id"];
  stageId: Stage["id"];
  contentType: string;
  assetId: string;
}) => {
  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: `${adventureId}/${stageId}/${assetId}`,
    ContentType: contentType,
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
