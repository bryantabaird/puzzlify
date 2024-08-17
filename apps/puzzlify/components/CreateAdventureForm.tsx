"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateAdventureForm = () => {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/adventure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formData.get("startDate"),
          name: formData.get("name"),
        }),
      });

      if (response.ok) {
        router.push("/adventures");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create adventure.");
      }
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="text-xl text-red-500">{error}</div>
      <form
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="my-2">
          <label htmlFor="startDate" className="block">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            className="border mx-2 border-gray-500 rounded"
          />
        </div>

        <div className="my-2">
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border mx-2 border-gray-500 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Create Adventure
        </button>
      </form>
    </>
  );
};

export default CreateAdventureForm;
