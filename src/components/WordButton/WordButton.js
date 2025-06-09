import React, { useEffect, useRef } from "react";
import * as styles from "./WordButton.module.css";
import { Toggle } from "../ui/toggle";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'react-syntax-highlighter/dist/esm/languages/prism/java';
import 'react-syntax-highlighter/dist/esm/languages/prism/c';
import { GameStatusContext } from "../../providers/GameStatusProvider";
import fitty from "fitty";

function WordButton({ word, language, fullCandidateSize }) {
  const { guessCandidate, setGuessCandidate } = React.useContext(GameStatusContext);
  const [isSelected, setIsSelected] = React.useState(!!guessCandidate.includes(word));
  const isCandidateListFull = guessCandidate.length === fullCandidateSize;
  const wordRef = useRef(null);

  useEffect(() => {
    setIsSelected(!!guessCandidate.includes(word));
  }, [guessCandidate]);

  useEffect(() => {
    //console.log("language", language)
    const fitInstance = fitty(wordRef.current, {
      minSize: 3, // Minimum font size in pixels
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
      id={`toggle-${word}`}
      className={`
        ${styles.growShrink}
        select-none
        transition-all duration-200
        [data-state=off]:hover:!bg-transparent
        hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]
      `}
      variant="outline"
      pressed={isSelected}
      onClick={flipSelection}
      style={{
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
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

export default WordButton;
