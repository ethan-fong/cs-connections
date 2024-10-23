import React from "react";

import InfoModal from "../modals/InfoModal";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

function Header() {
  const { title, loading } = React.useContext(PuzzleDataContext);

  if (loading) {
    return (
      <header>
        <h1 className="font-space-mono">Loading...</h1>
        <InfoModal />
      </header>
    );
  }

  // Set a default title if the title is null or undefined
  const displayTitle = title || "CS Connections";

  return (
    <header>
      <h1
        className="font-space-mono"
        style={{
          fontSize: displayTitle.length > 20 ? '1rem' : '1.5rem',
          whiteSpace: 'nowrap'
        }}
      >
        {displayTitle}
      </h1>
      <InfoModal />
    </header>
  );
}


export default Header;
