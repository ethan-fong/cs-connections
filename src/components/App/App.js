import React from "react";
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from "../Header";
import Game from "../Game";
import "./AppStyles.css";
import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";

function App() {
  return (
    <HashRouter>
      <Routes>
      <Route path="/game/:gameId" element={
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
      </Routes>
    </HashRouter>
  );
}


export default App;
