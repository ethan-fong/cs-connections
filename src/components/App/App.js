import React from "react";
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from "../Header";
import Game from "../Game";

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
              <Game />
            </div>
          </GameStatusProvider>
        </PuzzleDataProvider>
      } />
      </Routes>
    </HashRouter>
  );
}


export default App;
