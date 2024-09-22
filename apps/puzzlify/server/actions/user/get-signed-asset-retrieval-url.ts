"use server";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM
import { Adventure, Asset, Puzzle } from "@prisma/client";

const cloudfrontDistributionDomain = "https://doz3dod0wo07o.cloudfront.net";

const key = process.env.ASSET_STORAGE_PRIVATE_KEY;

const keyPairId = "K10SXXCDTNL72X";

if (!key) {
  throw new Error("No private key found");
}

export const getPuzzleFileUrl = async ({
  adventureId,
  puzzleId,
  assetId,
}: {
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
  assetId: Asset["id"];
}) => {
  const url = `${cloudfrontDistributionDomain}/${adventureId}/${puzzleId}/${assetId}`;

  const signedUrl = await getSignedUrl({
    url,
    keyPairId,
    dateLessThan: "2038-01-01",
    // TODO: Get functional on the server
    privateKey: key.split(String.raw`\n`).join("\n"),
  });

  return signedUrl;
};
