import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import PreviewGame from './PreviewGame';
import GameStatusProvider from '../../providers/GameStatusProvider';
import Swal from 'sweetalert2';


const API_BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : "https://vm006.teach.cs.toronto.edu/backend/";

const CreateGame = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState(localStorage.getItem('language') || '');
    const [course, setCourse] = useState(localStorage.getItem('course') || '');
    const [title, setTitle] = useState(localStorage.getItem('title') || '');
    const [info, setInfo] = useState(localStorage.getItem('info') || '');
    const [author, setAuthor] = useState(localStorage.getItem('author') || '');
    const [gameCode, setGameCode] = useState('');
    const [numCategories, setNumCategories] = useState(Number(localStorage.getItem('numCategories')) || 4);
    const [wordsPerCategory, setWordsPerCategory] = useState(Number(localStorage.getItem('wordsPerCategory')) || 4);
    const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) || Array.from({ length: 4 }, () => ({ name: '', words: Array(4).fill(''), explanation: '' })));

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('course', course);
    }, [course]);

    useEffect(() => {
        localStorage.setItem('title', title);
    }, [title]);

    useEffect(() => {
        localStorage.setItem('info', info);
    }, [info]);

    useEffect(() => {
        localStorage.setItem('author', author);
    }, [author]);

    useEffect(() => {
        localStorage.setItem('numCategories', numCategories);
    }, [numCategories]);

    useEffect(() => {
        localStorage.setItem('wordsPerCategory', wordsPerCategory);
    }, [wordsPerCategory]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const handleCategoryChange = (index, value) => {
        const newCategories = [...categories];
        newCategories[index].name = value;
        setCategories(newCategories);
    };
    
    const handleWordChange = (catIndex, wordIndex, value) => {
        const newCategories = [...categories];
        newCategories[catIndex].words[wordIndex] = value;
        setCategories(newCategories);
    };

    const handleExplanationChange = (index, value) => {
        const newCategories = [...categories];
        newCategories[index].explanation = value;
        setCategories(newCategories);
    };
    
    const handleNumCategoriesChange = (value) => {
        const numValue = Number(value);
        const newCategories = Array.from({ length: numValue }, (_, i) => ({
            name: categories[i]?.name || '',
            words: categories[i]?.words.slice(0, wordsPerCategory) || Array(wordsPerCategory).fill(''),
            explanation: categories[i]?.explanation || ''
        }));
        setCategories(newCategories);
        setNumCategories(numValue);
    };
    
    const handleWordsPerCategoryChange = (value) => {
        const numValue = Number(value);
        const newCategories = categories.map(cat => ({
            ...cat,
            words: Array.from({ length: numValue }, (_, i) => cat.words[i] || ''),
        }));
        setCategories(newCategories);
        setWordsPerCategory(numValue);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!language || !course || !title || !author) {
            toast.error('Please fill in all fields');
            return;
        }

        if (categories.some(category => !category.name || category.words.some(word => !word))) {
            toast.error('Please fill in all category names and words');
            return;
        }
        const duplicateCategoryIndex = categories.findIndex((category, index) => 
            categories.findIndex(cat => cat.name === category.name) !== index
        );

        if (duplicateCategoryIndex !== -1) {
            toast.error(`Duplicate category name found: ${categories[duplicateCategoryIndex].name}`);
            return;
        }

        const allWords = categories.flatMap(category => category.words);
        const duplicateWords = allWords.filter((word, index, self) => self.indexOf(word) !== index);

        if (duplicateWords.length > 0) {
            toast.error(`Duplicate words found across categories: ${[...new Set(duplicateWords)].join(', ')}`);
            return;
        }
        try {
            const adaptedGameData = {
                title,
                syntax_highlighting: language,
                author,
                num_categories: numCategories,
                words_per_category: wordsPerCategory,
                course,
                relevant_info: info,
                game: categories.map((category, index) => ({
                    category: category.name,
                    words: category.words,
                    difficulty: index + 1,
                    explanation: category.explanation
                }))
            };

            const response = await fetch(`${API_BASE_URL}api/upload/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adaptedGameData),
            });
            if (response.ok) {
                const responseData = await response.json();
                toast.success(`Game created successfully: ${responseData.message}`);
                const gameCodeMatch = responseData.message.match(/Your game code is: (\w+)/);
                if (gameCodeMatch) {
                    setGameCode(gameCodeMatch[1]);
                }
                handleReset(); // Clear form fields on successful submission
                
            } else if (response.status === 400) {
                const errorData = await response.json();
                toast.error(`Failed to create game: ${errorData.message}`);
            } else {
                toast.error('Failed to create game');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleReset = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setLanguage('');
                setCourse('');
                setTitle('');
                setInfo('');
                setAuthor('');
                setNumCategories(4);
                setWordsPerCategory(4);
                setCategories(Array.from({ length: 4 }, () => ({ name: '', words: Array(4).fill(''), explanation: '' })));
                localStorage.clear();
                Swal.fire(
                    'Reset!',
                    'Your form has been reset.',
                    'success'
                );
            }
        });
    };

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses`);
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                toast.error('Failed to fetch courses');
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <ToastContainer />
            <button 
                onClick={() => navigate('/')} 
                className="mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Home
            </button>
            <div className="bg-indigo-600 text-white py-4 rounded-md shadow-md mb-6">
                <h1 className="text-2xl font-bold text-center">Create Your Game</h1>
                <p className="text-center mt-2">Fill in the details below to create a new game</p>
            </div>
            {gameCode && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Game Created Successfully!</p>
                    <p>Your game code is: <span className="font-mono">{gameCode}</span></p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Language:</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Language</option>
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="java">Java</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course:</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title:</label>
                    <textarea value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Extra Info: (optional)</label>
                    <textarea value={info} onChange={(e) => setInfo(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author:</label>
                    <textarea value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Categories:</label>
                    <input type="number" value={numCategories} onChange={(e) => handleNumCategoriesChange(e.target.value)} min="3" max="4" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Words per Category:</label>
                    <input type="number" value={wordsPerCategory} onChange={(e) => handleWordsPerCategoryChange(e.target.value)} min="3" max="4" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {categories.map((category, catIndex) => (
                    <div key={catIndex} className={`space-y-2 p-4 ${catIndex % 2 === 0 ? 'bg-blue-100' : 'bg-white-100'} rounded-md`}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category {catIndex + 1} Name:</label>
                            <textarea value={category.name} onChange={(e) => handleCategoryChange(catIndex, e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instructor Explanation for Category {catIndex + 1}:</label>
                            <textarea value={category.explanation} onChange={(e) => handleExplanationChange(catIndex, e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {category.words.map((word, wordIndex) => (
                            <div key={wordIndex}>
                                <label className="block text-sm font-medium text-gray-700">Word {wordIndex + 1}:</label>
                                <textarea value={word} onChange={(e) => handleWordChange(catIndex, wordIndex, e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        ))}
                    </div>
                ))}
                <div className="flex space-x-4">
                <button type="button" onClick={handleReset} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Reset</button>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Game</button>
                </div>
            </form>
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-700">Game Metadata</h2>
                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                    <p><strong>Language:</strong> {language}</p>
                    <p><strong>Course:</strong> {course}</p>
                    <p><strong>Author:</strong> {author}</p>
                    <p><strong>Number of Categories:</strong> {numCategories}</p>
                    <p><strong>Words per Category:</strong> {wordsPerCategory}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-700 mt-8 mb-4">Game Preview</h2>
            <GameStatusProvider>
                <PreviewGame 
                    title={title}
                    words={categories.map(category => category.words)}
                    related_info={info}
                    numCategories={numCategories}
                    language={language}
                    categorySize={wordsPerCategory}
                />
            </GameStatusProvider>
        </div>
    );
};

export default CreateGame;
