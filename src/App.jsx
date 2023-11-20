import { useState } from "react";
import "./App.css";
import AppContext from "./context/context";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      <Router>
        <div className="App">
          <h1>Sex</h1>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
