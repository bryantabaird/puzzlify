"use client";

import { getSignedAssetUploadUrl } from "@/server/actions/user/get-signed-asset-upload-url";
import React, { useState } from "react";

export default function UploadFileForm() {
  const [file, setFile] = useState<File>();

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
      const { assetUploadUrl } = await getSignedAssetUploadUrl();
      console.log("url", assetUploadUrl);

      // Step 4: Upload the file to S3 using the presigned URL
      const uploadResponse = await fetch(assetUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type, // Ensure the correct MIME type is used
        },
        body: file,
      });

      if (uploadResponse.ok) {
        alert("File uploaded successfully!");
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
