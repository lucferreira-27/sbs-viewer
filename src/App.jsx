import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SBSProvider } from "./contexts/SBSContext";

import Header from "./components/Header";

import HomePage from "./components/HomePage";

import SearchPage from "./components/SearchPage";

import BrowsePage from "./components/BrowsePage";

function App() {
  return (
    <SBSProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto py-8">
            <Routes />
          </main>
        </div>
      </BrowserRouter>
    </SBSProvider>
  );
}

export default App;
