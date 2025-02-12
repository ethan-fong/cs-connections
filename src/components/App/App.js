import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "../Header";
import Game from "../Game";
import "./AppStyles.css";
import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";
import AnalyticsPage from "../AnalyticsPage/AnalyticsPage"
import HomePage from "../HomePage/HomePage";
import InstructorPage from "../InstructorPage/InstructorPage";
import CreateGame from "../CreateGame/CreateGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <HomePage />
        } />
        <Route path="/instructor/" element={
            <InstructorPage />
        } />
        <Route path="/play/:gameId" element={
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
        <Route path="/preview/:gameId" element={
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
        <Route path="/stats/:gameId" element={
            <AnalyticsPage />
        } />
        <Route path="/create/" element={
            <CreateGame />
        } />
      </Routes>
    </Router>
  );
}

export default App;
