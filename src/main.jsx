import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SBSProvider } from "./contexts/SBSContext";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import BrowsePage from "./components/BrowsePage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SBSProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-paper/30 via-white to-paper/20">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/browse/:volumeId" element={<BrowsePage />} />
              <Route path="/browse" element={<BrowsePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SBSProvider>
  </React.StrictMode>
);
