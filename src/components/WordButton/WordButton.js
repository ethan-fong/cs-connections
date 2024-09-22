import React from "react";
import * as styles from "./WordButton.module.css";
import { Toggle } from "../ui/toggle";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
3
import { GameStatusContext } from "../../providers/GameStatusProvider";

function WordButton({ word, fullCandidateSize }) {
  const { guessCandidate, setGuessCandidate } =
    React.useContext(GameStatusContext);
  const [isSelected, setIsSelected] = React.useState(
    !!guessCandidate.includes(word)
  );

  const isCandidateListFull = guessCandidate.length == fullCandidateSize;

  React.useEffect(() => {
    setIsSelected(!!guessCandidate.includes(word));
  }, [guessCandidate]);

  function flipSelection() {
    if (isSelected) {
      // remove from candidateGuess
      const updatedGuessCandidate = guessCandidate.filter((w) => {
        return w !== word;
      });
      setGuessCandidate(updatedGuessCandidate);
      // set state to *not* selected
      setIsSelected(false);
    } else {
      // check if the candidate array is full
      if (!isCandidateListFull) {
        // add to candidateGuess array
        setGuessCandidate([...guessCandidate, word]);
        // set state to *selected*
        setIsSelected(true);
      }
    }
  }

  //const fontSizeByWordLength = 9characters works with 0.6rem

  function getFontSize(word) {
    const baseLength = 7;
    const wordLength = word.length;
    const numNewlines = (word.match(/\n/g) || []).length;
    let fontSize = 1;

    // Adjust font size based on length
    if (wordLength > baseLength) {
        const numExtraChars = wordLength - baseLength;
        fontSize = fontSize - numExtraChars * 0.1;
    }

    // More aggressive scaling if newlines are present
    if (numNewlines > 0) {
        fontSize = fontSize - numNewlines * 0.1; // Adjust this factor as needed
    }

    // Ensure font size doesn't go below 0.6em
    fontSize = Math.max(0.6, fontSize);
    console.log(fontSize)

    return `${fontSize}em`;
  }
  // word = "washingtonian";
  return (
    <Toggle
      className={`${styles.growShrink} select-none`}
      variant="outline"
      pressed={isSelected}
      onClick={flipSelection}
      style={{
        height: 'auto', // Allow height to adjust based on content
        width: 'auto', // Set width to auto to adjust based on content
        padding: '8px', // Optional: Add padding to the toggle
      }}
    >
      <SyntaxHighlighter
        language="python" // Change this to the appropriate language
        style={solarizedlight}
        customStyle={{
          fontSize: getFontSize(word), // Set the font size here
          display: 'inline', // Ensure it displays inline if desired
          padding: '8px', // Optional: Add some padding
          borderRadius: '4px', // Optional: Add rounded corners
          whiteSpace: 'normal', // Allow text to wrap
          backgroundColor: '#ffffff', // Set background color to white
        }}
      >
        {word}
      </SyntaxHighlighter>
    </Toggle>
  );
}

export default WordButton;
