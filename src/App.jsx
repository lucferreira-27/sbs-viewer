import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { SBSProvider } from "./contexts/SBSContext";

import Header from "./components/Header";

import HomePage from "./components/HomePage";

import SearchPage from "./components/SearchPage";

import BrowsePage from "./components/BrowsePage";

function App() {
  return (
    <Router>
      <SBSProvider>
        <div className="min-h-screen bg-paper text-ink">
          <Header />

          <main className="py-8"></main>
        </div>
      </SBSProvider>
    </Router>
  );
}

export default App;
