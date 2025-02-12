import React from "react";
import { shuffleGameData } from "../../lib/game-helpers";
import GameGrid from "../GameGrid";
import NumberOfMistakesDisplay from "../NumberOfMistakesDisplay";
import GameLostModal from "../modals/GameLostModal";
import GameWonModal from "../modals/GameWonModal";
import StartGameModal from '../modals/StartGameModal';
import { Separator } from "../ui/separator";
import ConfettiExplosion from "react-confetti-explosion";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import GameControlButtonsPanel from "../GameControlButtonsPanel";
import ViewResultsModal from "../modals/ViewResultsModal";
import 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import RelatedInfo from "./RelatedInfo";

const BASE_API = process.env.NODE_ENV === 'development' ? "http://localhost:8080/api/" : "https://vm006.teach.cs.toronto.edu/backend/api/";

function Game() {
  const { gameData, categorySize, numCategories, error, loading, gameNumber, relevantInfo } = React.useContext(PuzzleDataContext);
  const { isGameStarted, setIsGameStarted, submittedGuesses, solvedGameData, isGameOver, isGameWon, timeToGuess } =
    React.useContext(GameStatusContext);
  // Wait until gameData is available and then shuffle
  const [shuffledRows, setShuffledRows] = React.useState([]); // Start as an empty array
  React.useEffect(() => {
    if (gameData && gameData.length > 0) {
      // Shuffle game data once it's available
      const shuffledRows = shuffleGameData({ gameData });
      setShuffledRows(shuffledRows);
    }
  }, [gameData]); // Dependency on gameData
  const [isEndGameModalOpen, setisEndGameModalOpen] = React.useState(false);
  const [gridShake, setGridShake] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };
  React.useEffect(() => {
    const handleResize = () => {
      // Trigger a re-render by updating state
      setShuffledRows([...shuffledRows]);
    };
  
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [shuffledRows]);
  // use effect to update Game Grid after a row has been correctly solved
  React.useEffect(() => {
    if (!gameData){
      return
    }
    const categoriesToRemoveFromRows = solvedGameData.map(
      (data) => data.category
    );
    const dataLeftForRows = gameData.filter((data) => {
      return !categoriesToRemoveFromRows.includes(data.category);
    });
    if (dataLeftForRows.length > 0) {
      setShuffledRows(shuffleGameData({ gameData: dataLeftForRows }));
    }
  }, [solvedGameData]);

  // Handle End Game!
  React.useEffect(() => {
    if (!isGameOver) {
      return;
    }
    // extra delay for game won to allow confetti to show
    //console.log("ending game state", submittedGuesses, isGameWon, timeToGuess)

    // Define a function to send the POST request
    const sendPostRequest = async () => {
      //console.log("Game Code", gameNumber);
      const endGameData = {
        "gameCode" : gameNumber,
        "submittedGuesses" : submittedGuesses,  // This is an array
        "isGameWon": isGameWon,                // This is a boolean
        "timeToGuess": timeToGuess,            // This is an array
      };
      if (submittedGuesses.length === 0) {
        //console.log("not sending empty data")
        return;
      }
      try {
        const API_COLLECT_URL = `${BASE_API}submit-stats/`
        //console.log(API_COLLECT_URL);
        //console.log(JSON.stringify(endGameData));
        const response = await fetch(API_COLLECT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(endGameData)
        });
        
        if (!response.ok) {
          //console.log(response);
          throw new Error('Network response was not ok');
        }
        
        console.log('End game data sent successfully');
      } catch (error) {
        console.error('Failed to send end game data:', error);
      }
    };
    const modalDelay = isGameWon ? 2000 : 250;
    const delayModalOpen = window.setTimeout(() => {
      setisEndGameModalOpen(true);
      //unmount confetti after modal opens
      setShowConfetti(false);
      sendPostRequest();
    }, modalDelay);

    if (isGameWon) {
      setShowConfetti(true);
    }

    return () => window.clearTimeout(delayModalOpen);
  }, [isGameOver]);
  if (loading) {
    //console.log("should be loading!")
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if data fetching fails
  }

  if (!gameData) {
    return <div>No game data available</div>; // Show message if no data is available
  }

  return (
    <>
      {relevantInfo && (
        <RelatedInfo relevantInfo={relevantInfo} />
      )}
      <div className="text-center mt-4 pb-4">
        <h3 className="text-xl md:text-2xl lg:text-3xl">
          Create {numCategories} groups of {categorySize}
        </h3>
      </div>

      <div className="h-3/4 px-4 md:px-8 lg:px-16 pt-4 pb-4">
        {isGameOver && isGameWon ? (
          <GameWonModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        ) : (
          <GameLostModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        )}
        <GameGrid
          gameRows={shuffledRows}
          shouldGridShake={gridShake}
          setShouldGridShake={setGridShake}
        />
        {showConfetti && isGameOver && (
          <div className="grid place-content-center">
            <ConfettiExplosion
              particleCount={100}
              force={0.8}
              duration={2500}
            />
          </div>
        )}
        <Separator />

        {!isGameOver ? (
          <>
            <NumberOfMistakesDisplay />
            <GameControlButtonsPanel
              shuffledRows={shuffledRows}
              setShuffledRows={setShuffledRows}
              setGridShake={setGridShake}
            />
          </>
        ) : (
          <ViewResultsModal />
        )}
      </div>
      <StartGameModal onStart={handleStartGame} />
    </>
  );
}

export default Game;
