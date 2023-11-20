import { useState } from "react";
import "./App.css";
import AppContext from "./context/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import WithSubnavigation from "./components/NavBar/NavBar";
import Register from "./views/Register/Register";
import Login from "./views/LogIn/Login";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  return (
    <AppContext.Provider value={{ ...appState, setUser: setAppState  }}>
      <Router>
        <div className="App">
          <WithSubnavigation />

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
