import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white shadow mb-0">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Link to="/ingest" className="text-2xl font-bold text-blue-700 hover:text-blue-900">
            Kelp Assignment
          </Link>
        </div>
      </nav>
      <div className="container mx-auto flex flex-wrap justify-center gap-3 mt-4 mb-8">
        <Link to="/ingest">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Ingest Events</button>
        </Link>
        <Link to="/ingestion-status">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Ingestion Status</button>
        </Link>
        <Link to="/timeline">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Timeline</button>
        </Link>
        <Link to="/search">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Search Events</button>
        </Link>
        <Link to="/overlapping-events">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Overlapping Events</button>
        </Link>
        <Link to="/temporal-gaps">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Temporal Gaps</button>
        </Link>
        <Link to="/influence">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Event Influence</button>
        </Link>
      </div>
    </>
  );
}