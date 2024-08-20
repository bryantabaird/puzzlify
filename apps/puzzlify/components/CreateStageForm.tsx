"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Adventure } from "@prisma/client";

type CreateStageFormProps = {
  adventure: Adventure;
};

const CreateStageForm = ({ adventure }: CreateStageFormProps) => {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/adventure/${adventure.id}/stage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          riddle: formData.get("riddle"),
          answer: formData.get("answer"),
        }),
      });

      if (response.ok) {
        router.push(`/adventure/${adventure.id}`);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create stage.");
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
          <label htmlFor="riddle" className="block">
            Riddle
          </label>
          <input
            type="text"
            id="riddle"
            name="riddle"
            className="border mx-2 border-gray-500 rounded"
          />
        </div>

        <div className="my-2">
          <label htmlFor="answer" className="block">
            Answer
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            className="border mx-2 border-gray-500 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Create Stage
        </button>
      </form>
    </>
  );
};

export default CreateStageForm;
