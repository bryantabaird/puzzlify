"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditStage({
  params,
}: {
  params: { adventureId: string; stageId: string };
}) {
  const router = useRouter();
  const [stage, setStage] = useState({
    delay: 0,
    riddle: "",
    answer: "",
    hints: [] as { id: string; hint: string; delay: number }[],
  });
  const [newHint, setNewHint] = useState("");
  const [delay, setDelay] = useState(0);
  const [loading, setLoading] = useState(true);

  const { adventureId, stageId } = params;

  useEffect(() => {
    const fetchStage = async () => {
      const response = await fetch(
        `/api/adventure/${adventureId}/stage/${stageId}`,
      );
      const stageData = await response.json();

      if (stageData) {
        setStage({
          delay: stageData.delay || 0,
          riddle: stageData.riddle || "",
          answer: stageData.answer || "",
          hints: stageData.hints || [],
        });
      }
      setLoading(false);
    };

    fetchStage();
  }, [adventureId, stageId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Update the stage in the database
    const response = await fetch(
      `/api/adventure/${adventureId}/stage/${stageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stage),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return;
    }

    // Redirect to the stage details page
    router.push(`/adventure/${adventureId}/stage/${stageId}`);
  };

  const handleAddHint = () => {
    setStage((prev) => ({
      ...prev,
      hints: [
        ...prev.hints,
        { id: Date.now().toString(), hint: newHint, delay: 0 },
      ],
    }));
    setNewHint("");
  };

  const handleHintChange = (index: number, value: string) => {
    const updatedHints = [...stage.hints];
    updatedHints[index].hint = value;
    setStage((prev) => ({
      ...prev,
      hints: updatedHints,
    }));
  };

  const handleHintDelayChange = (index: number, value: number) => {
    const updatedHints = [...stage.hints];
    updatedHints[index].delay = value;
    setStage((prev) => ({
      ...prev,
      hints: updatedHints,
    }));
  };

  const handleDeleteHint = (index: number) => {
    const updatedHints = stage.hints.filter((_, i) => i !== index);
    setStage((prev) => ({
      ...prev,
      hints: updatedHints,
    }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Stage</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="riddle"
            className="block text-sm font-medium text-gray-700"
          >
            Riddle
          </label>
          <input
            id="riddle"
            type="text"
            value={stage.riddle}
            onChange={(e) => setStage({ ...stage, riddle: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            Answer
          </label>
          <input
            type="text"
            id="answer"
            value={stage.answer}
            onChange={(e) => setStage({ ...stage, answer: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="hints"
            className="block text-sm font-medium text-gray-700"
          >
            Hints
          </label>
          {stage.hints.map((hint, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={hint.hint}
                onChange={(e) => handleHintChange(index, e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                value={hint.delay}
                onChange={(e) =>
                  handleHintDelayChange(index, parseInt(e.target.value))
                }
                id="delay"
                name="delay"
                className="border mx-2 border-gray-500 rounded"
              />
              <button
                type="button"
                onClick={() => handleDeleteHint(index)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="New hint"
            />
            <input
              type="number"
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value))}
              id="delay"
              name="delay"
              className="border mx-2 border-gray-500 rounded"
            />
            <button
              type="button"
              onClick={handleAddHint}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Hint
            </button>
          </div>
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
