import React, { useState, useEffect, createContext } from 'react';
import { puzzleAnswers } from "../../lib/time-utils";

export const PuzzleDataContext = createContext('default_context');
const JSON_URL = "http://127.0.0.1:8000/api/getgame/2/"
const MAX_RETRIES = 3; // Number of retries
// function PuzzleDataProvider({ children }) {
//   const [gameData, setGameData] = React.useState(puzzleAnswers);
//   const categorySize = gameData[0].words.length;
//   const numCategories = gameData.length;
//   return (
//     <PuzzleDataContext.Provider
//       value={{ gameData, numCategories, categorySize }}
//     >
//       {children}
//     </PuzzleDataContext.Provider>
//   );
// }

const RETRY_DELAY = 2000;

export default function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [title, setTitle] = React.useState(null);
  const [author, setAuthor] = React.useState(null);
  const [categorySize, setCategorySize] = useState(null);
  const [numCategories, setNumCategories] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async (retries = MAX_RETRIES) => {
      try {
        console.log('Fetching data...');
        const response = await fetch(JSON_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setGameData(data.game);
        setNumCategories(data.num_categories);
        setCategorySize(data.words_per_category);
        setTitle(data.title);
        setAuthor(data.author);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.log('Fetch error:', error);
        if (retries > 0) {
          console.log('Retrying...');
          setTimeout(() => fetchGameData(retries - 1), RETRY_DELAY);
        } else {
          setError(error.message);
          setLoading(false); // Set loading to false even on error
        }
      }
    };

    fetchGameData();
  }, []);


  return (
    <PuzzleDataContext.Provider value={{ gameData, categorySize, numCategories, error, loading, title, author }}>
      {children}
    </PuzzleDataContext.Provider>
  );
}