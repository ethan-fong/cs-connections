import React from "react";
import { range } from "../../lib/utils";
import { Circle, CircleSlash } from "lucide-react";
import { MAX_MISTAKES } from "../../lib/constants";
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

function NumberOfMistakesDisplay() {
  const { numMistakesUsed } = React.useContext(GameStatusContext);
  const mistakeRange = range(MAX_MISTAKES);
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
