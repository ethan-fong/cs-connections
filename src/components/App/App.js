import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "../Header";
import Game from "../Game";
import "./AppStyles.css";
import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";
import AnalyticsPage from "../AnalyticsPage/AnalyticsPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/play/:gameId" element={
          <PuzzleDataProvider>
            <GameStatusProvider>
              <div className="wrapper">
                <Header />
                <Toaster />
                <div className="gamezoomwrapper"> {/* This div applies the zoom */}
                  <Game />
                </div>
              </div>
            </GameStatusProvider>
          </PuzzleDataProvider>
        } />
        <Route path="/stats/:gameId" element={
            <AnalyticsPage />
        } />
      </Routes>
    </Router>
  );
}

export default App;
