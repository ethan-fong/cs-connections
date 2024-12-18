import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';

export const PuzzleDataContext = createContext('default_context');

const BASE_API = process.env.NODE_ENV === 'development'
  ? "http://localhost:8080/api/"
  : "https://vm006.teach.cs.toronto.edu/backend/api/";
const MAX_RETRIES = 3; // Number of retries for fetching game data
const RETRY_DELAY = 2000;

export default function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [gameNumber, setGameNumber] = useState(null);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [categorySize, setCategorySize] = useState(null);
  const [numCategories, setNumCategories] = useState(null);
  const [relevantInfo, setRelevantInfo] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { gameId } = useParams();  // Extract gameId from URL

  useEffect(() => {
    const fetchGameData = async (retries = MAX_RETRIES) => {
      if (!gameNumber) {
        setGameNumber(gameId);
      }
      try {
        const JSON_URL = `${BASE_API}games/code/${gameId}/?format=json`;
        console.log('Fetching data...');
        const response = await fetch(JSON_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch game data due to ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        console.log('Fetched data:', data);
        if (Array.isArray(data) && data.length > 0) {
          data = data[0];
        }
        setGameData(data.game);
        setNumCategories(data.num_categories);
        setCategorySize(data.words_per_category);
        setTitle(data.title);
        setLanguage(data.syntax_highlighting);
        setAuthor(data.author);
        setRelevantInfo(data.relevant_info);
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
  }, [gameId]);


  return (
    <PuzzleDataContext.Provider value={{ gameData, categorySize, numCategories, error, loading, title, author, gameNumber, relevantInfo, language}}>
      {children}
    </PuzzleDataContext.Provider>
  );
}