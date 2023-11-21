import { useState, useEffect } from "react";
import "./App.css";
import AppContext from "./context/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import WithSubnavigation from "./components/NavBar/NavBar";
import Register from "./views/Register/Register";
import Login from "./views/LogIn/Login";
import { auth, db } from "./config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { fetchUserName } from "./services/user.service";
import Quiz from "../src/components/Quiz/Quiz";
import TeacherProfile from "./views/TeacherProfile/TeacherProfile";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminUserName = await fetchUserName(user.uid);
          const adminUsersRef = ref(db, `users/${adminUserName}`);
          const adminSnapshot = await get(adminUsersRef);

          if (adminSnapshot.exists()) {
            const userData = adminSnapshot.val();
            const isAdmin = userData.isAdmin || false;

            setAppState({
              user,
              userData,
              isAdmin,
              loading: false,
            });
          } else {
            setAppState({
              user,
              userData: null,
              isAdmin: false,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setAppState({
          user: null,
          userData: null,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, setUser: setAppState }}>
      <Router>
        <div className="App">
          <WithSubnavigation />

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/teacher" element={<TeacherProfile />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
