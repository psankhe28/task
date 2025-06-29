import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingestEvents } from "../api/api";


export default function IngestEvents () {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const res = await ingestEvents(file);
    setJobId(res.data.jobId);
  };

  const handleViewStatus = () => {
    navigate("/ingestion-status", { state: { jobId } });
  };

  return (
    <div className="w-full-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Ingest Events File</h2>
      <div className="flex items-center space-x-3">
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!file}
        >
          Upload
        </button>
      </div>
      {jobId && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
          Job ID: <span className="font-mono">{jobId}</span>
          <button
            onClick={handleViewStatus}
            className="ml-4 text-blue-600 underline hover:text-blue-800"
          >
            View Ingestion Status
          </button>
        </div>
      )}
    </div>
  );
};