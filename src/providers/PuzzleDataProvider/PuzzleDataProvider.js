import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';

export const PuzzleDataContext = createContext('default_context');

const BASE_API = process.env.REACT_APP_LOCAL_DEVELOPMENT
  ? "http://localhost:8000/api/"
  : "https://connections-backend-production.up.railway.app/api/";
const MAX_RETRIES = 3; // Number of retries

const RETRY_DELAY = 2000;

export default function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [gameNumber, setGameNumber] = useState(null);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [categorySize, setCategorySize] = useState(null);
  const [numCategories, setNumCategories] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { gameId } = useParams();  // Extract gameId from URL

  useEffect(() => {
    const fetchGameData = async (retries = MAX_RETRIES) => {
      if (!gameNumber){
        console.log("setting game number to ", gameId);
        setGameNumber(gameId)
      }
      try {
        const JSON_URL = `${BASE_API}connectionsgames/${gameId}/?format=json`
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
    <PuzzleDataContext.Provider value={{ gameData, categorySize, numCategories, error, loading, title, author, gameNumber}}>
      {children}
    </PuzzleDataContext.Provider>
  );
}