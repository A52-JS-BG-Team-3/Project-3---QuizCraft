import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { fetchUserName } from "./services/user.service";
import AppContext from "./context/context";
import WithSubnavigation from "./components/NavBar/NavBar";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import Login from "./views/LogIn/Login";
import Quiz from "../src/components/Quiz/Quiz";
import TeacherProfile from "./views/TeacherProfile/TeacherProfile";
import UserProfile from "./views/UserProfile/UserProfile";
import GroupManagement from "./components/Groups/GropManagment";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";

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
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Login />} />
            {appState.user && (<Route path="/userprofile" element={<UserProfile />} />)}
            <Route path ="/groups" element={<GroupManagement/>} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/teacher" element={<TeacherProfile />} />
            <Route path="/" element={<Home />} />
            <Route path="/createquiz" element={<CreateQuiz />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
