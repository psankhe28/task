import { useState } from "react";
import { getEventInfluence } from "../api/api";

export default function InfluencePath() {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [path, setPath] = useState(null);

  const fetchPath = async () => {
    const res = await getEventInfluence(source, target);
    setPath(res.data);
  };

  return (
    <div className="w-full-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Find Influence Path</h2>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          placeholder="Source Event ID"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          placeholder="Target Event ID"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={fetchPath}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!source || !target}
        >
          Find
        </button>
      </div>
      {path ? (
        <pre className="bg-gray-100 rounded p-4 border border-gray-200 text-sm overflow-x-auto">{JSON.stringify(path, null, 2)}</pre>
      ) : (
        <p className="text-gray-500">No path found or not loaded.</p>
      )}
    </div>
  );
}
