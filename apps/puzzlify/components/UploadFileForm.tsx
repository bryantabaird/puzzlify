"use client";

import { addAssetToStage } from "@/server/actions/host/add-asset-to-stage";
import { getSignedAssetUploadUrl } from "@/server/actions/user/get-signed-asset-upload-url";
import { useParams } from "next/navigation";
import React, { useState } from "react";

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
      const { assetUploadUrl, assetId } = await getSignedAssetUploadUrl({
        adventureId,
        stageId,
      });
      console.log("url", assetUploadUrl);

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
          await addAssetToStage({ adventureId, stageId }, { assetId });
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
      <input type="file" onChange={handleFileChange} required />
      <button type="submit" className="btn">
        Upload to S3
      </button>
    </form>
  );
}
