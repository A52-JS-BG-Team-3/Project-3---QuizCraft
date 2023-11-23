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
import UserProfile from "./components/UserProfile/UserProfile";
import GroupManagement from "./components/Groups/GropManagment";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import GroupDetails from "./views/GroupDetails/GroupDetails";
import { Spinner } from "@chakra-ui/react";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isAdmin: false,
    isLoading: true, 
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
              isLoading: false, 
            });
          } else {
            setAppState({
              user,
              userData: null,
              isAdmin: false,
              isLoading: false, 
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAppState({
            user: null,
            userData: null,
            isAdmin: false,
            isLoading: false, 
          });
        }
      } else {
        setAppState({
          user: null,
          userData: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, setUser: setAppState }}>
      <Router>
        <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          {appState.isLoading ? (
           <Spinner
           thickness="4px"
           speed="0.65s"
           emptyColor="gray.200"
           color="brand.blue"
           size="xl"
           mt="20%"
         />
          ) : (
            <>
              <WithSubnavigation />
              <Routes>
                <Route path="/signup" element={<Register />} />
                <Route path="/signin" element={<Login />} />
                {appState.user && (<Route path="/userprofile" element={<UserProfile />} />)}
                <Route path="/groups" element={<GroupManagement />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/teacher" element={<TeacherProfile />} />
                <Route path="/" element={<Home />} />
                <Route path="/createquiz" element={<CreateQuiz />} />
                <Route path="/group/:groupId" element={<GroupDetails />} />
          </Routes>
            </>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
