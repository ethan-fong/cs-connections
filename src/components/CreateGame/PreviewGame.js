import React, { useEffect, useRef, useState } from "react";
import { Toggle } from "../ui/toggle";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'react-syntax-highlighter/dist/esm/languages/prism/markdown'; // Import the markdown language definition
import 'react-syntax-highlighter/dist/esm/languages/prism/java'; // Import the java language definition
import 'react-syntax-highlighter/dist/esm/languages/prism/c'; // Import the c language definition
import fitty from "fitty";
import GameControlButtonsPanel from "../GameControlButtonsPanel";
import NumberOfMistakesDisplay from "../NumberOfMistakesDisplay";
import InfoModal from "../modals/InfoModal";

function WordButton({ word, language }) {
    const wordRef = useRef(null);
    useEffect(() => {
        const fitInstance = fitty(wordRef.current, {
            minSize: 5,
            maxSize: 100,
            multiLine: true,
        });

        wordRef.current.style.textAlign = 'left';
        wordRef.current.style.padding = '10%';

        return () => {
            fitInstance.unsubscribe();
        };
    }, [word]);

    return (
        <Toggle
            id={`toggle-${word}`}
            variant="outline"
            style={{
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid grey',
            }}
        >
            <span ref={wordRef}>
                <SyntaxHighlighter
                    language={language}
                    style={solarizedlight}
                    customStyle={{
                        display: 'inline',
                        padding: '2px',
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap',
                        backgroundColor: '#ffffff',
                    }}
                >
                    {word}
                </SyntaxHighlighter>
            </span>
        </Toggle>
    );
}

function WordRow({ words, language }) {
    const columns = words.length;
    const columnClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
    }[columns] || 'grid-cols-1';

    return (
        <div className={`grid ${columnClass} gap-2`}>
            {words.map((word, index) => (
                <WordButton key={`${word}-${index}`} word={word} language={language} fullCandidateSize={words.length} />
            ))}
        </div>
    );
}

function GameGrid({ words, title, related_info, numCategories, categorySize, language }) {
    return (
        <div>
            <div className="flex items-center justify-between h-16 w-full px-4" style={{ borderBottom: '1px solid var(--color-gray-700)' }}>
                <h1
                    className="font-space-mono text-center mr-4"
                    style={{
                        fontSize: title.length > 20 ? '1.25rem' : '1.5rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {title}
                </h1>
                <InfoModal />
            </div>
            {related_info && (
                <div className="related-info-container p-4 mb-4 bg-gray-100 rounded-lg shadow-md mt-4">
                    <h4 className="text-lg font-semibold mb-2">Extra Information</h4>
                    <SyntaxHighlighter language="markdown" style={solarizedlight}>
                        {related_info}
                    </SyntaxHighlighter>
                </div>
            )}
            <div className="text-center mt-4 pb-4">
                <h3 className="text-xl md:text-2xl lg:text-3xl">
                    Create {numCategories} groups of {categorySize}
                </h3>
            </div>
            {Array.isArray(words) && words.map((row, idx) => (
                <div key={idx} className="mb-4">
                    <WordRow language={language} words={Array.isArray(row) ? row : [row]} />
                </div>
            ))}
            <>
                <NumberOfMistakesDisplay />
                <GameControlButtonsPanel
                    shuffledRows={["a", "b"]}
                    setShuffledRows={() => {}}
                    setGridShake={() => {}}
                />
            </>
        </div>
    );
}

export default GameGrid;
