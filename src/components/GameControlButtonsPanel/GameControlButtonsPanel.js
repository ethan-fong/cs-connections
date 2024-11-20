import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Shuffle, Undo, SendHorizontal } from "lucide-react";
import { isGuessCorrect, isGuessRepeated, shuffleGameData } from "../../lib/game-helpers";

import { GameStatusContext } from "../../providers/GameStatusProvider";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

function GameControlButtonsPanel({ shuffledRows, setShuffledRows, setGridShake }) {
  const {
    isGameOver,
    setIsGameOver,
    guessCandidate,
    setGuessCandidate,
    submittedGuesses,
    setSubmittedGuesses,
    solvedGameData,
    setSolvedGameData,
  } = React.useContext(GameStatusContext);
  const { gameData, categorySize } = React.useContext(PuzzleDataContext);
  const { toast } = useToast();

  // Track window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Function to update size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Attach event listener for resize and orientation change
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initial call to set the size
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  function deselectAll() {
    setGuessCandidate([]);
  }

  function submitCandidateGuess() {
    if (guessCandidate.length !== categorySize) return;

    if (isGuessRepeated({ submittedGuesses, guessCandidate })) {
      toast({
        label: "Notification",
        title: "Repeated Guess",
        description: "You previously made this guess!",
      });
      return;
    }

    setSubmittedGuesses([...submittedGuesses, guessCandidate]);

    const {
      isCorrect,
      correctWords,
      correctCategory,
      isGuessOneAway,
      correctDifficulty,
      correctImageSrc,
    } = isGuessCorrect({ guessCandidate, gameData });

    if (isCorrect) {
      setSolvedGameData([
        ...solvedGameData,
        { category: correctCategory, words: correctWords, difficulty: correctDifficulty, imageSrc: correctImageSrc },
      ]);
      setGuessCandidate([]);
    } else {
      setGridShake(true);
      if (isGuessOneAway) {
        toast({
          label: "Notification",
          title: "Close Guess",
          description: "You were one guess away from correctly guessing a category!",
        });
      }
    }
  }

  function GiveUp() {
    setIsGameOver(true);
  }

  // Dynamically adjust grid and button styles based on window size (e.g., smaller layout on small screens)
  const gridColumns = windowSize.width < 600 ? "grid-cols-2" : "grid-cols-4"; // Adjust columns for small screens

  return (
    <div className="p-4">
      <div className={`grid ${gridColumns} gap-4`}>
        <Button variant="submit" onClick={GiveUp} disabled={isGameOver}>
          <p className="select-none">Give Up</p>
        </Button>
        <Button disabled={isGameOver} variant="secondary" onClick={() => setShuffledRows(shuffleGameData({ gameData: shuffledRows }))}>
          <Shuffle className="h-4 w-4 mr-2" strokeWidth={1} />
          <p className="select-none">Shuffle</p>
        </Button>
        <Button size="deselectallsize" disabled={isGameOver} variant="secondary" onClick={deselectAll}>
          <Undo className="h-4 w-4 mr-2" strokeWidth={1} />
          <p className="select-none">Deselect All</p>
        </Button>
        <Button variant="submit" onClick={submitCandidateGuess} disabled={isGameOver || guessCandidate.length !== categorySize}>
          <SendHorizontal className="h-4 w-4 mr-2" strokeWidth={1} />
          <p className="select-none">Submit</p>
        </Button>
      </div>
    </div>
  );
}

export default GameControlButtonsPanel;
