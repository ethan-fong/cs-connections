import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomepageModal from "../modals/HomepageModal";
import { Home } from "lucide-react";

const API_BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : "https://vm006.teach.cs.toronto.edu/backend/";

const InstructorPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    const deleteGame = async (id) => {
        try {
            const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];
            const response = await fetch(`${API_BASE_URL}instructor/games/${id}/`, {
                method: 'DELETE',
                credentials: 'include', // Ensure cookies are included with the request
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });

            if (response.ok) {
                setGames(games.filter(game => game.id !== id));
                toast.success("Game deleted successfully!");
            } else if (response.status === 404) {
                toast.error("Game not found.");
            } else {
                console.log(response)
                toast.error("Failed to delete game.");
            }
        } catch (error) {
            toast.error('Error deleting game');
        }
    };

    const createGame = () => {
        navigate('/create');
    };

    const checkDjangoAuthentication = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}check_authenticated/`, {
                method: 'GET',
                credentials: 'include', // Ensure cookies are included with the request
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setIsAuthenticated(true);
                    setUsername(data.username);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
            toast.error('Error Authenticating');
        }
    };

    const fetchGames = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}instructor/games/`, {
                method: 'GET',
                credentials: 'include', // Ensure cookies are included with the request
            });

            if (response.ok) {
                const data = await response.json();
                setGames(data);
            } else {
                toast.error('Failed to fetch games');
            }
        } catch (error) {
            toast.error('Error fetching games');
        }
    };

    useEffect(() => {
        checkDjangoAuthentication();
        fetchGames();
    }, []);

    const goHome = () => {
        navigate("/");
    };

    const instructorGames = games.filter(game => game.published);
    const studentGames = games.filter(game => !game.published);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col mb-6">
                <div className="flex justify-between items-center w-full">
                    <button onClick={goHome} className="mr-4">
                        <Home />
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-800">Instructor Dashboard</h1>
                    <HomepageModal />
                </div>
            </div>
            {isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-md">
                    <h2 className="text-2xl font-semibold">Welcome, {username}!</h2>
                    <p>You are logged in as an instructor.</p>
                </div>
            )}
            {/* Game Actions */}
            <div className="mb-6">
                <button
                    onClick={createGame}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                    Create Instructor Game
                </button>
            </div>

            {/* Instructor Games List */}
            <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Instructor Made Games</h2>
                {instructorGames.length > 0 ? (
                    <ul className="space-y-3">
                        {instructorGames.map(game => (
                            <li key={game.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                                <span className="text-lg font-medium text-gray-800">{game.title} by {game.author} (ID: {game.id})</span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/play/${game.game_code}`)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-all duration-200"
                                    >
                                        Play
                                    </button>
                                    <button
                                        onClick={() => deleteGame(game.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-all duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No instructor made games available.</p>
                )}
            </div>

            {/* Student Games List */}
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Made Games</h2>
                {studentGames.length > 0 ? (
                    <ul className="space-y-3">
                        {studentGames.map(game => (
                            <li key={game.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                                <span className="text-lg font-medium text-gray-800">{game.title} by {game.author} (ID: {game.id})</span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/play/${game.game_code}`)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-all duration-200"
                                    >
                                        Play
                                    </button>
                                    <button
                                        onClick={() => deleteGame(game.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-all duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No student made games available.</p>
                )}
            </div>

            <ToastContainer />
        </div>
    );
};

export default InstructorPage;
