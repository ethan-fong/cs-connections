import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Download } from 'lucide-react';

JSON_EXCLUDED_FIELDS = ["id", "game_code", "published", "created_at"];

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

const GameList = ({ title, gamesToShow, currentPage, totalPages, setPageNumbers, courseId, notify }) => {
    const downloadAsJson = (game, excludeFields = []) => {
        const filteredGame = Object.keys(game)
            .filter(key => !excludeFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = game[key];
                return obj;
            }, {});
        filteredGame.course = filteredGame.course.name;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredGame, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${game.title}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <CollapsibleSection title={title}>
            {gamesToShow.length > 0 ? (
                <>
                    {gamesToShow.map((game, idx) => (
                        <div key={idx} className="mb-4 p-4 border rounded-lg shadow-sm bg-blue-100">
                            <div className="p-4 border rounded-lg shadow-sm bg-white relative">
                                <span className="text-lg font-medium text-gray-800">{game.title}</span>
                                <p className="text-sm text-gray-600">By {game.author}</p>
                                <p className="text-sm text-gray-600">Game Code: {game.game_code}</p>
                                <div className="flex space-x-4 mt-2 items-center">
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
                                    <div className="relative group">
                                        <button
                                            onClick={() => downloadAsJson(game, JSON_EXCLUDED_FIELDS)}
                                            className="btn btn-secondary bg-white text-gray-500 px-2 py-2 rounded hover:bg-green-400 transition duration-300"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Download as JSON
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() =>
                                setPageNumbers(prev => ({
                                    ...prev,
                                    [courseId]: Math.max(currentPage - 1, 1),
                                }))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 mx-1">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setPageNumbers(prev => ({
                                    ...prev,
                                    [courseId]: Math.min(currentPage + 1, totalPages),
                                }))
                            }
                            disabled={currentPage === totalPages}
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
    );
};

export default GameList;