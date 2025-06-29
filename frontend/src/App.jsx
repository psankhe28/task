import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TemporalGap from "./pages/TemporalGap";
import InfluencePath from "./pages/InfluencePath";
import Ingest from "./pages/IngestData";
import IngestionStatus from "./pages/IngestStatus";
import Timeline from "./pages/Timelines";
import Search from "./pages/EventsSearch";
import OverlappingEvents from "./pages/OverlappingEvents";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 bg-white rounded shadow">
          <Routes>
            <Route path="/" element={<Ingest />} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/ingestion-status" element={<IngestionStatus />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/search" element={<Search />} />
            <Route path="/overlapping-events" element={<OverlappingEvents />} />
            <Route path="/temporal-gaps" element={<TemporalGap />} />
            <Route path="/influence" element={<InfluencePath />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}