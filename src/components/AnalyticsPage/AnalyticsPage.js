import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGuessCount } from './api'; // Adjust the path as needed
import styles from './AnalyticsPage.css';
import LiveGraph from './LiveGraph'; // Ensure correct path
import GuessDistributionChart from './GuessDistributionChart'; // Ensure correct path

const AnalyticsDashboard = () => {
  const { gameId } = useParams();  // Extract gameId from URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [submissions, setSubmissions] = useState(0); // Default to 1 or any other number as needed
  const [wins, setWins] = useState(0); // Default to 1 or any other number as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchGuessCount(gameId);
        console.log(result);
        // Convert parsedResult to an array of [key, value] pairs
        setSubmissions(result.submission_count);
        setWins(result.wins);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [gameId]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px', position: 'relative' }}>
      <button 
        onClick={handleGoHome} 
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Home
      </button>
      <h1 className="stats-h1">Stats for Game {gameId}</h1>
      <div className="stats-row">
        <div className="stats-p">Submissions: {submissions}</div>
        <div className="stats-p">Game Wins: {wins}</div>
        <div className="stats-p">Completion Rate: {(wins / submissions * 100).toFixed(2)}%</div>
      </div>
      <div className="chart-container" style={{ marginBottom: '40px' }}>
        <h2>Average Time to Solve Each Category</h2>
        <LiveGraph selectedNumber={gameId} />
      </div>
      <div className="chart-container">
        <h2>Top 10 Most Common Guesses</h2>
        <GuessDistributionChart selectedNumber={gameId} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;