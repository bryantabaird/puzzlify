"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditAdventure({
  params,
}: {
  params: { adventureId: string };
}) {
  const router = useRouter();
  const [adventure, setAdventure] = useState({ name: "", startDate: "" });
  const [loading, setLoading] = useState(true);
  const adventureId = params.adventureId;

  useEffect(() => {
    const fetchAdventure = async () => {
      const response = await fetch(`/api/adventure/${adventureId}`);
      const adventure = await response.json();

      if (adventure) {
        setAdventure({
          name: adventure.name || "",
          startDate: adventure.startDate
            ? new Date(adventure.startDate).toISOString().substring(0, 10)
            : "",
        });
      }
      setLoading(false);
    };

    fetchAdventure();
  }, [adventureId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Update the adventure in the database
    const response = await fetch(`/api/adventure/${adventureId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adventure),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return;
    }

    // Redirect to the adventure details page
    router.push(`/adventure/${adventureId}`);
  };

  if (loading) return <p>Loading...</p>;

  console.log("adventure", adventure);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Adventure</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Adventure Name
          </label>
          <input
            type="text"
            id="name"
            value={adventure.name}
            onChange={(e) =>
              setAdventure({ ...adventure, name: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={adventure.startDate}
            onChange={(e) =>
              setAdventure({ ...adventure, startDate: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
