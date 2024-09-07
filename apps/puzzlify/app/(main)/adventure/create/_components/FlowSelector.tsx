import { useState } from "react";

export default function TrackSelector() {
  const [selectedTrack, setSelectedTrack] = useState<string>("single");

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Select Track Type
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label
          className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedTrack === "single"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          onClick={() => setSelectedTrack("single")}
        >
          <input
            type="radio"
            name="track"
            value="single"
            checked={selectedTrack === "single"}
            onChange={() => setSelectedTrack("single")}
            className="hidden"
          />
          <div className="text-2xl mb-2">🚶</div>
          <span className="text-lg font-medium text-gray-800">
            Single Track
          </span>
        </label>

        {/* Parallel Track Option */}
        <label
          className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedTrack === "parallel"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          onClick={() => setSelectedTrack("parallel")}
        >
          <input
            type="radio"
            name="track"
            value="parallel"
            checked={selectedTrack === "parallel"}
            onChange={() => setSelectedTrack("parallel")}
            className="hidden"
          />
          <div className="text-2xl mb-2">🛤️</div>
          <span className="text-lg font-medium text-gray-800">
            Parallel Track
          </span>
        </label>

        {/* Custom Track Option */}
        <label
          className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            selectedTrack === "custom"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          onClick={() => setSelectedTrack("custom")}
        >
          <input
            type="radio"
            name="track"
            value="custom"
            checked={selectedTrack === "custom"}
            onChange={() => setSelectedTrack("custom")}
            className="hidden"
          />
          <div className="text-2xl mb-2">🔧</div>
          <span className="text-lg font-medium text-gray-800">
            Custom Track
          </span>
        </label>
      </div>
    </div>
  );
}
