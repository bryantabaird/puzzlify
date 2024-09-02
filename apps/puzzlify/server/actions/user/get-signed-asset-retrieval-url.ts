"use server";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM
import { Adventure, Stage } from "@prisma/client";

const cloudfrontDistributionDomain = "https://doz3dod0wo07o.cloudfront.net";

const key = process.env.ASSET_STORAGE_PRIVATE_KEY;

const keyPairId = "K10SXXCDTNL72X";

if (!key) {
  throw new Error("No private key found");
}

export const getStageFileUrls = ({
  adventureId,
  stageId,
  assetIds,
}: {
  adventureId: Adventure["id"];
  stageId: Stage["id"];
  assetIds: Stage["assetIds"];
}) => {
  const signedUrlsMap = assetIds.map((assetId) => {
    const url = `${cloudfrontDistributionDomain}/${adventureId}/${stageId}/${assetId}`;

    const signedUrl = getSignedUrl({
      url,
      keyPairId,
      dateLessThan: "2038-01-01",
      // TODO: Get functional on the server
      privateKey: key.split(String.raw`\n`).join("\n"),
    });

    return { assetId, signedUrl };
  });

  console.log("signedUrlsMap", signedUrlsMap);

  return signedUrlsMap;
};
