import axios from 'axios';

const API_BASE_URL = "https://vm006.teach.cs.toronto.edu/backend/";

export const fetchGuessTimeDistribution = async (number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}timedist/${number}/?format=json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchGuessDistribution = async (number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}guessdist/${number}/?format=json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchGuessCount = async (number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}count/${number}/?format=json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};