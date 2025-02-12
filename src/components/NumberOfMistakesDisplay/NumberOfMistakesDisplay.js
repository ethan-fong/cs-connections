import React, { useEffect } from "react";
import { range } from "../../lib/utils";
import { Circle, CircleSlash, Infinity as InfinityIcon, Skull } from "lucide-react";
import { GameStatusContext } from "../../providers/GameStatusProvider";

function SingleMistakeDisplay({ isUsed }) {
  return (
    <div className="p-1">
      {isUsed ? (
        <CircleSlash className="h-4 w-4 mt-1 stroke-neutral-400 sm:h-6 sm:w-6 md:h-8 md:w-8" />
      ) : (
        <Circle className="h-4 w-4 mt-1 fill-green-300 stroke-cyan-300 sm:h-6 sm:w-6 md:h-8 md:w-8" />
      )}
    </div>
  );
}

function NumberOfMistakesDisplay({ numMistakesUsed: propNumMistakesUsed, maxMistakes: propMaxMistakes }) {
  const context = React.useContext(GameStatusContext);
  const numMistakesUsed = propNumMistakesUsed ?? context.numMistakesUsed;
  const maxMistakes = propMaxMistakes ?? context.maxMistakes;

  // Re-render the component when maxMistakes changes or is undefined or -1
  useEffect(() => {
    if (maxMistakes === -1 || maxMistakes == null) {
      // Handling logic when maxMistakes is not defined or unlimited
    }
  }, [maxMistakes]); // Watch maxMistakes to trigger re-render

  // If maxMistakes is not defined or is -1 (no limit), show the Infinity icon
  if (maxMistakes === -1 || maxMistakes == null) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-base sm:text-lg md:text-xl mb-2">Mistakes Remaining: </p>
        <div className="flex flex-row gap-x-4">
          <InfinityIcon className="h-4 w-4 mt-1 stroke-neutral-400 sm:h-6 sm:w-6 md:h-8 md:w-8" />
        </div>
      </div>
    );
  }

  // If maxMistakes is zero, show the Sudden Death message and icon
  if (maxMistakes === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-base sm:text-lg md:text-xl mb-2">Sudden Death</p>
        <div className="flex flex-row gap-x-4">
          <Skull className="h-4 w-4 mt-1 stroke-red-600 sm:h-6 sm:w-6 md:h-8 md:w-8" />
        </div>
      </div>
    );
  }

  // Create an array of numbers from 0 to maxMistakes (exclusive)
  const mistakeRange = range(maxMistakes);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-base sm:text-lg md:text-xl mb-2">Mistakes Remaining: </p>
      <div className="flex flex-row gap-x-4">
        {mistakeRange.map((el) => (
          <SingleMistakeDisplay key={el} isUsed={el < numMistakesUsed} />
        ))}
      </div>
    </div>
  );
}

export default NumberOfMistakesDisplay;
