import React from "react";

import InfoModal from "../modals/InfoModal";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { useEffect } from "react";

function Header() {
  const { title, loading } = React.useContext(PuzzleDataContext);
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <header className="flex flex-col items-center justify-center h-16">
        <h1 className="font-space-mono text-center">Loading...</h1>
        <InfoModal />
      </header>
    );
  }

  // Set a default title if the title is null or undefined
  const displayTitle = title || "CS Connections";

  return (
    <header className="flex items-center justify-between h-16 w-full px-4">
      <h1
        className="font-space-mono text-center mr-4"
        style={{
          fontSize: displayTitle.length > 20 ? '1.25rem' : '1.5rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {displayTitle}
      </h1>
      <InfoModal />
    </header>
  );
}

export default Header;

