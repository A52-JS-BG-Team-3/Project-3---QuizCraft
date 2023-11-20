import { useState } from "react";
import "./App.css";
import AppContext from "./context/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import WithSubnavigation from "./components/NavBar/NavBar";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      <Router>
        <div className="App">
          <WithSubnavigation />
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
