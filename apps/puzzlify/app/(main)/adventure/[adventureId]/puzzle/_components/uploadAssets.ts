import { createAsset } from "@/server/actions/host/create-asset";
import { getStageFileUrl } from "@/server/actions/user/get-signed-asset-retrieval-url";
import { getSignedAssetUploadUrl } from "@/server/actions/user/get-signed-asset-upload-url";

export type FileAsset = {
  assetId: string;
  file: File;
};

type UploadAssetProps = {
  adventureId: string;
  stageId: string;
  fileAssets: Array<FileAsset>;
};

export default async function uploadAssets({
  adventureId,
  stageId,
  fileAssets,
}: UploadAssetProps) {
  try {
    // Create an array of promises for all files
    const uploadPromises = fileAssets.map(async ({ file, assetId }) => {
      const { assetUploadUrl } = await getSignedAssetUploadUrl({
        adventureId,
        stageId,
        contentType: file.type,
        assetId: assetId,
      });

      const uploadResponse = await fetch(assetUploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadResponse.ok) {
        try {
          const url = await getStageFileUrl({ adventureId, stageId, assetId });
          await createAsset({ adventureId, stageId }, { url, id: assetId });
          return { status: "fulfilled", file };
        } catch (error) {
          console.error("Error adding asset to stage", error);
          return {
            status: "rejected",
            reason: "Failed to add asset to stage.",
          };
        }
      } else {
        return { status: "rejected", reason: "Failed to upload file." };
      }
    });

    // Use Promise.allSettled to ensure all uploads are handled
    const results = await Promise.allSettled(uploadPromises);

    // Handle results
    const successfulUploads = results.filter(
      (result) => result.status === "fulfilled",
    );
    const failedUploads = results.filter(
      (result) => result.status === "rejected",
    );

    // Provide feedback on the results
    if (successfulUploads.length > 0) {
      alert(`${successfulUploads.length} file(s) uploaded successfully.`);
    }

    if (failedUploads.length > 0) {
      console.error("Errors during upload:", failedUploads);
      alert(`${failedUploads.length} file(s) failed to upload.`);
    }
  } catch (error) {
    console.error("Error during file upload", error);
    alert("An error occurred while uploading the files.");
  }
}
