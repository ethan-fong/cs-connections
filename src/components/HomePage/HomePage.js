import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionItem,
} from "../ui/accordion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GameList from "./GameList";
import ResponsiveHeading from './ResponsiveHeading';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : "https://vm006.teach.cs.toronto.edu/backend/";

const HomePage = () => {
    const navigate = useNavigate();
    const notify = () => toast("Button clicked!");
    const [courseList, setCourseList] = useState([]);
    const [instructorGames, setInstructorGames] = useState([]);
    const [studentGames, setStudentGames] = useState([]);
    const [instructorPageNumbers, setInstructorPageNumbers] = useState({});
    const [studentPageNumbers, setStudentPageNumbers] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/courses`);
                const coursesData = response.data;
                setCourseList(coursesData);

                const instructor = [];
                const student = [];

                coursesData.forEach(course => {
                    course.games.forEach(game => {
                        if (game.published) {
                            instructor.push(game);
                        } else {
                            student.push(game);
                        }
                    });
                });
                coursesData.sort((a, b) => {
                    if (a.name.toLowerCase() === 'unassigned') return 1;
                    if (b.name.toLowerCase() === 'unassigned') return -1;
                    return 0;
                });
                setInstructorGames(instructor);
                setStudentGames(student);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const goToCreatePage = (courseName) => {
        localStorage.setItem('course', courseName);
        navigate('/create');
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col mb-6">
                <ResponsiveHeading/>
                <div className="flex items-center pt-4 mb-6 space-x-4">
                    <input
                        type="text"
                        placeholder="Enter game code"
                        className="flex-grow border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const gameCode = e.target.value;
                                if (gameCode) {
                                    navigate(`/play/${gameCode.toUpperCase()}`);
                                }
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            const gameCode = document.querySelector('input[type="text"]').value;
                            if (gameCode) {
                                navigate(`/play/${gameCode}`);
                            }
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                    >
                        Play Game
                    </button>
                </div>
                <Accordion>
                    {courseList.map((course, index) => {
                        // Instructor games pagination
                        const instructorCurrentPage = instructorPageNumbers[course.id] || 1;
                        const instructorGamesForCourse = instructorGames
                            .filter(game => game.course.id === course.id)
                            .sort((a, b) => {
                                const regex = /Week (\d+)/i;
                                const matchA = a.title.match(regex);
                                const matchB = b.title.match(regex);
                                const weekA = matchA ? Math.min(parseInt(matchA[1], 10), 12) : Number.MAX_VALUE;
                                const weekB = matchB ? Math.min(parseInt(matchB[1], 10), 12) : Number.MAX_VALUE;
                                return weekA - weekB;
                            });
                        const instructorTotalPages = Math.ceil(instructorGamesForCourse.length / 5);
                        const instructorStartIndex = (instructorCurrentPage - 1) * 5;
                        const instructorGamesToShow = instructorGamesForCourse.slice(instructorStartIndex, instructorStartIndex + 5);

                        // Student games pagination
                        const studentCurrentPage = studentPageNumbers[course.id] || 1;
                        const studentGamesForCourse = studentGames.filter(game => game.course.id === course.id);
                        const studentTotalPages = Math.ceil(studentGamesForCourse.length / 5);
                        const studentStartIndex = (studentCurrentPage - 1) * 5;
                        const studentGamesToShow = studentGamesForCourse.slice(studentStartIndex, studentStartIndex + 5);

                        return (
                            <AccordionItem key={index} className="mb-6 border rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg cursor-pointer">{course.name}</h3>
                                <div className="p-6 bg-gray-50 rounded-b-lg">
                                    <GameList
                                        title="Instructor Games"
                                        gamesToShow={instructorGamesToShow}
                                        currentPage={instructorCurrentPage}
                                        totalPages={instructorTotalPages}
                                        setPageNumbers={setInstructorPageNumbers}
                                        courseId={course.id}
                                        notify={notify}
                                    />
                                    <GameList
                                        title="Student Games"
                                        gamesToShow={studentGamesToShow}
                                        currentPage={studentCurrentPage}
                                        totalPages={studentTotalPages}
                                        setPageNumbers={setStudentPageNumbers}
                                        courseId={course.id}
                                        notify={notify}
                                    />
                                    <button
                                        onClick={() => goToCreatePage(course.name)}
                                        className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-4"
                                    >
                                        Create Student Game
                                    </button>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
                <ToastContainer />
            </div>
        </div>
    );
};

export default HomePage;
