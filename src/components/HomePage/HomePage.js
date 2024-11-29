import React from 'react';
import {
    Accordion,
    AccordionItem,
} from "../ui/accordion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : "https://vm006.teach.cs.toronto.edu/backend/";

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-4">
            <div
                className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 rounded"
                onClick={toggle}
            >
                <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
                <span>{isOpen ? '-' : '+'}</span>
            </div>
            {isOpen && (
                <div className="mt-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const notify = () => toast("Button clicked!");
    const [courseList, setCourseList] = useState([]);
    const [publishedGames, setPublishedGames] = useState([]);
    const [unpublishedGames, setUnpublishedGames] = useState([]);
    const [publishedPageNumbers, setPublishedPageNumbers] = useState({});
    const [unpublishedPageNumbers, setUnpublishedPageNumbers] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/courses`);
                const coursesData = response.data;
                setCourseList(coursesData);

                const published = [];
                const unpublished = [];

                coursesData.forEach(course => {
                    course.games.forEach(game => {
                        if (game.published) {
                            published.push(game);
                        } else {
                            unpublished.push(game);
                        }
                    });
                });

                setPublishedGames(published);
                setUnpublishedGames(unpublished);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const goToCreatePage = () => {
        navigate('/create');
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">CS Connections</h1>
            <Accordion>
                {courseList.map((course, index) => {
                    // Published games pagination
                    const publishedCurrentPage = publishedPageNumbers[course.id] || 1;
                    const publishedGamesForCourse = publishedGames
                        .filter(game => game.course.id === course.id)
                        .sort((a, b) => {
                            const regex = /week (\d+)/;
                            const matchA = a.title.match(regex);
                            const matchB = b.title.match(regex);
                            const weekA = matchA ? Math.min(parseInt(matchA[1], 10), 12) : Number.MAX_VALUE;
                            const weekB = matchB ? Math.min(parseInt(matchB[1], 10), 12) : Number.MAX_VALUE;
                            return weekA - weekB;
                        });
                    const publishedTotalPages = Math.ceil(publishedGamesForCourse.length / 5);
                    const publishedStartIndex = (publishedCurrentPage - 1) * 5;
                    const publishedGamesToShow = publishedGamesForCourse.slice(publishedStartIndex, publishedStartIndex + 5);

                    // Unpublished games pagination
                    const unpublishedCurrentPage = unpublishedPageNumbers[course.id] || 1;
                    const unpublishedGamesForCourse = unpublishedGames.filter(game => game.course.id === course.id);
                    const unpublishedTotalPages = Math.ceil(unpublishedGamesForCourse.length / 5);
                    const unpublishedStartIndex = (unpublishedCurrentPage - 1) * 5;
                    const unpublishedGamesToShow = unpublishedGamesForCourse.slice(unpublishedStartIndex, unpublishedStartIndex + 5);

                    return (
                        <AccordionItem key={index} className="mb-6 border rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg cursor-pointer">{course.name}</h3>
                            <div className="p-6 bg-gray-50 rounded-b-lg">
                                <CollapsibleSection title="Published Games">
                                    {publishedGamesToShow.length > 0 ? (
                                        <>
                                            {publishedGamesToShow.map((game, idx) => (
                                                <div key={idx} className="mb-4 p-4 border rounded-lg shadow-sm bg-blue-100">
                                                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                                                        <span className="text-lg font-medium text-gray-800">{game.title}</span>
                                                        <p className="text-sm text-gray-600">By {game.author}</p>
                                                        <p className="text-sm text-gray-600">Game Code: {game.game_code}</p>
                                                        <div className="flex space-x-4 mt-2">
                                                            <Link
                                                                to={`/play/${game.game_code}`}
                                                                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                                                onClick={notify}
                                                            >
                                                                Play
                                                            </Link>
                                                            <Link
                                                                to={`/stats/${game.game_code}`}
                                                                className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                                                                onClick={notify}
                                                            >
                                                                Stats
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    onClick={() =>
                                                        setPublishedPageNumbers(prev => ({
                                                            ...prev,
                                                            [course.id]: Math.max(publishedCurrentPage - 1, 1),
                                                        }))
                                                    }
                                                    disabled={publishedCurrentPage === 1}
                                                    className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Previous
                                                </button>
                                                <span className="px-3 py-1 mx-1">
                                                    Page {publishedCurrentPage} of {publishedTotalPages}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setPublishedPageNumbers(prev => ({
                                                            ...prev,
                                                            [course.id]: Math.min(publishedCurrentPage + 1, publishedTotalPages),
                                                        }))
                                                    }
                                                    disabled={publishedCurrentPage === publishedTotalPages}
                                                    className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>No games found.</p>
                                    )}
                                </CollapsibleSection>
                                <CollapsibleSection title="Unpublished Games">
                                    {unpublishedGamesToShow.length > 0 ? (
                                        <>
                                            {unpublishedGamesToShow.map((game, idx) => (
                                                <div key={idx} className="mb-4 p-4 border rounded-lg shadow-sm bg-blue-100">
                                                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                                                        <span className="text-lg font-medium text-gray-800">{game.title}</span>
                                                        <p className="text-sm text-gray-600">By {game.author}</p>
                                                        <p className="text-sm text-gray-600">Game Code: {game.game_code}</p>
                                                        <div className="flex space-x-4 mt-2">
                                                            <Link
                                                                to={`/play/${game.game_code}`}
                                                                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                                                onClick={notify}
                                                            >
                                                                Play
                                                            </Link>
                                                            <Link
                                                                to={`/stats/${game.game_code}`}
                                                                className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                                                                onClick={notify}
                                                            >
                                                                Stats
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    onClick={() =>
                                                        setUnpublishedPageNumbers(prev => ({
                                                            ...prev,
                                                            [course.id]: Math.max(unpublishedCurrentPage - 1, 1),
                                                        }))
                                                    }
                                                    disabled={unpublishedCurrentPage === 1}
                                                    className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Previous
                                                </button>
                                                <span className="px-3 py-1 mx-1">
                                                    Page {unpublishedCurrentPage} of {unpublishedTotalPages}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setUnpublishedPageNumbers(prev => ({
                                                            ...prev,
                                                            [course.id]: Math.min(unpublishedCurrentPage + 1, unpublishedTotalPages),
                                                        }))
                                                    }
                                                    disabled={unpublishedCurrentPage === unpublishedTotalPages}
                                                    className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>No games found.</p>
                                    )}
                                </CollapsibleSection>
                            </div>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <button
                onClick={goToCreatePage}
                className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-6"
            >
                Create New Game
            </button>
            <ToastContainer />
        </div>
    );
};

export default HomePage;
