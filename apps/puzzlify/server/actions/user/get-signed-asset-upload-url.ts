"use server";

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Adventure, Puzzle } from "@prisma/client";

const s3 = new S3Client({ region: "us-west-2" });
const BUCKET_NAME = "adventure-app-puzzle-images";

export const getSignedAssetUploadUrl = async ({
  adventureId,
  puzzleId,
  contentType,
  assetId,
}: {
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
  contentType: string;
  assetId: string;
}) => {
  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: `${adventureId}/${puzzleId}/${assetId}`,
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
