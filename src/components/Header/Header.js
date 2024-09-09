import React from "react";

import InfoModal from "../modals/InfoModal";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

function Header() {
  const {title, loading, author} = React.useContext(PuzzleDataContext);
  if (loading){
    return (
      <header>
        <h1 className="font-space-mono">Loading...</h1>
        <InfoModal />
      </header>
    );
  }
  return (
    <header>
      <h1 className="font-space-mono">{title} by {author}</h1>
      <InfoModal />
    </header>
  );
}

export default Header;
