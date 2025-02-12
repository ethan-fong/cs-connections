import React from "react";
import { PuzzleDataContext } from "../PuzzleDataProvider";
import { saveGameStateToLocalStorage } from "../../lib/local-storage";

export const GameStatusContext = React.createContext();

function GameStatusProvider({ children }) {
  const { gameData, maxMistakes } = React.useContext(PuzzleDataContext);
  const [submittedGuesses, setSubmittedGuesses] = React.useState([]);
  const [startTime, setStartTime] = React.useState(null); // Start time
  const [timeToGuess, setTimeToGuess] = React.useState([]); // Array to track times for each guess
  const [solvedGameData, setSolvedGameData] = React.useState([]);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameWon, setIsGameWon] = React.useState(false);
  const [guessCandidate, setGuessCandidate] = React.useState([]);
  const [isGameStarted, setIsGameStarted] = React.useState(false);

  // Set startTime once when the first guess is made
  React.useEffect(() => {
    if (isGameStarted && !startTime) {
      setStartTime(Date.now()); // Set start time when the first guess is submitted
    }
  }, [isGameStarted]);

  const numMistakesUsed = submittedGuesses.length - solvedGameData.length;

  // Use effect to check if the game is won
  React.useEffect(() => {
    if (gameData) {
      if (solvedGameData.length === gameData.length) {
        setIsGameOver(true);
        setIsGameWon(true);
      }

      const gameState = {
        submittedGuesses,
        solvedGameData,
        gameData,
        startTime,
        timeToGuess, // This may not have the latest time in the current render cycle, use updatedTimes inside the setTimeToGuess function to see it immediately
      };
      saveGameStateToLocalStorage(gameState);
    }
  }, [solvedGameData, startTime]);

  // Use effect to check if all mistakes have been used and end the game accordingly
  React.useEffect(() => {
    console.log(maxMistakes);
    if (gameData && startTime) {
      // Handle case where maxMistakes is undefined or -1 (unlimited mistakes)
      const limitMistakes = maxMistakes !== undefined && maxMistakes !== -1;

      if (limitMistakes && numMistakesUsed > maxMistakes) {
        setIsGameOver(true);
        setIsGameWon(false);
      }

      const currentTime = Date.now();
      const timeTakenForGuess = (currentTime - startTime) / 1000;

      setTimeToGuess((prevTimes) => {
        const updatedTimes = [...prevTimes, timeTakenForGuess]; // Create a new array with the updated times
        return updatedTimes;
      });

      const gameState = {
        submittedGuesses,
        solvedGameData,
        gameData,
        startTime,
        timeToGuess, // This may not have the latest time in the current render cycle
      };
      saveGameStateToLocalStorage(gameState);
    }
  }, [submittedGuesses, gameData, startTime, maxMistakes]); // Add maxMistakes to the dependencies to trigger effect on changes

  return (
    <GameStatusContext.Provider
      value={{
        isGameStarted,
        setIsGameStarted,
        isGameOver,
        setIsGameOver,
        isGameWon,
        numMistakesUsed,
        maxMistakes, // Still passing down maxMistakes through context
        solvedGameData,
        setSolvedGameData,
        submittedGuesses,
        setSubmittedGuesses,
        guessCandidate,
        setGuessCandidate,
        startTime,
        timeToGuess, // Expose array of times taken for each guess
      }}
    >
      {children}
    </GameStatusContext.Provider>
  );
}

export default GameStatusProvider;
