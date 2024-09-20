"use client";

import { createAsset } from "@/server/actions/host/create-asset";
import { getStageFileUrl } from "@/server/actions/user/get-signed-asset-retrieval-url";
import { getSignedAssetUploadUrl } from "@/server/actions/user/get-signed-asset-upload-url";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

export default function UploadFileForm() {
  const [file, setFile] = useState<File>();
  const { adventureId, stageId } = useParams<{
    adventureId: string;
    stageId: string;
  }>();

  // TODO: typing
  // @ts-expect-error
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // TODO: typing
  // @ts-expect-error
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      const assetId = self.crypto.randomUUID();
      const { assetUploadUrl } = await getSignedAssetUploadUrl({
        adventureId,
        stageId,
        contentType: file.type,
        assetId,
      });

      const uploadResponse = await fetch(assetUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type, // Ensure the correct MIME type is used
        },
        body: file,
      });

      if (uploadResponse.ok) {
        // TODO: Consider transactionalizing
        try {
          const url = await getStageFileUrl({ adventureId, stageId, assetId });

          await createAsset({ adventureId, stageId }, { url, id: assetId });
          alert("File uploaded successfully.");
        } catch (error) {
          console.error("Error adding asset to stage", error);
          alert("Failed to add asset to stage.");
        }
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error during file upload", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        required
        accept={allowedFileTypes.join(", ")}
      />
      <button type="submit" className="btn">
        Upload to S3
      </button>
    </form>
  );
}
