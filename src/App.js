import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import AppBar from "./components/AppBar/AppBar";
import BoardContent from "./components/BoardContent/BoardContent";
import "./App.css";


function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="trello">
      <AppBar setSearchValue={setSearchValue} />
      <BoardContent searchValue={searchValue} />
    </div>
  );
}

export default App;

