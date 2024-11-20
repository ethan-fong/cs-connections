import React, { useEffect, useRef } from "react";
import * as styles from "./WordButton.module.css";
import { Toggle } from "../ui/toggle";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GameStatusContext } from "../../providers/GameStatusProvider";
import fitty from "fitty";

function WordButton({ word, fullCandidateSize }) {
  const { guessCandidate, setGuessCandidate } = React.useContext(GameStatusContext);
  const [isSelected, setIsSelected] = React.useState(!!guessCandidate.includes(word));
  const isCandidateListFull = guessCandidate.length === fullCandidateSize;
  const wordRef = useRef(null);

  useEffect(() => {
    setIsSelected(!!guessCandidate.includes(word));
  }, [guessCandidate]);

  useEffect(() => {
    const fitInstance = fitty(wordRef.current, {
      minSize: 5, // Minimum font size in pixels
      maxSize: 100, // Maximum font size in pixels
      multiLine: true, // Ensure newlines and spaces are preserved
    });

    // Left justify the text
    wordRef.current.style.textAlign = 'left';
    // Add internal padding relative to the box
    wordRef.current.style.padding = '10%';

    // Cleanup the fitty instance on unmount
    return () => {
      fitInstance.unsubscribe();
    };
  }, [word]);

  function flipSelection() {
    if (isSelected) {
      const updatedGuessCandidate = guessCandidate.filter((w) => w !== word);
      setGuessCandidate(updatedGuessCandidate);
      setIsSelected(false);
    } else {
      if (!isCandidateListFull) {
        setGuessCandidate([...guessCandidate, word]);
        setIsSelected(true);
      }
    }
  }

  return (
    <Toggle
      id={`toggle-${word}`} // Unique ID for the toggle
      className={`${styles.growShrink} select-none`}
      variant="outline"
      pressed={isSelected}
      onClick={flipSelection}
      style={{
        height: '100%',
        width: '100%', // Allow it to take full width of its container
        boxSizing: 'border-box', // Ensure padding is included in the element's total width and height
        border: '1px solid grey', // Added grey border
      }}
    >
      <span ref={wordRef}>
        <SyntaxHighlighter
          language="python" // Change this to the appropriate language
          style={solarizedlight}
          customStyle={{
            display: 'inline',
            padding: '2px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap', // Preserve newlines and indentation
            backgroundColor: '#ffffff',
          }}
        >
          {word}
        </SyntaxHighlighter>
      </span>
    </Toggle>
  );
}

export default WordButton;
