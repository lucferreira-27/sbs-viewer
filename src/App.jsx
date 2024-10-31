import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SBSProvider } from "./contexts/SBSContext";

import Header from "./components/shared/Header";

function App() {
  return (
    <SBSProvider>
      <BrowserRouter>
        <div className="min-h-screen ">
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
