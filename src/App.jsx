import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { fetchUserName } from "./services/user.service";
import { useContext } from "react";
import AppContext from "./context/context";
import WithSubnavigation from "./components/NavBar/NavBar";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import Login from "./views/LogIn/Login";
import RandomQuiz from "./components/RandomQuiz/RandomQuiz";
import TeacherProfile from "./views/TeacherProfile/TeacherProfile";
import UserProfile from "./views/UserProfile/UserProfileView";
import GroupManagement from "./components/Groups/GropManagment";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import GroupDetails from "./views/GroupDetails/GroupDetails";
import { Spinner } from "@chakra-ui/react";
import UserQuizzes from "./components/CreateQuiz/UserQuizzes/UserQuizzes";
import EditQuiz from "./components/CreateQuiz/EditQuiz/EditQuiz";
import QuizzesOverview from "/src/views/QuizzesOverview/QuizzesOverview.jsx";
import TeacherQuizzes from "./views/TeachersQuizzes/TeacherQuizzes";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isAdmin: false,
    isLoading: true,
    role: null,
  });
  const { user, userData } = useContext(AppContext);

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
              role: userData.role,
            });
          } else {
            setAppState({
              user,
              userData: null,
              isAdmin: false,
              isLoading: false,
              role: "student",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAppState({
            user: null,
            userData: null,
            isAdmin: false,
            isLoading: false,
            role: "student",
          });
        }
      } else {
        setAppState({
          user: null,
          userData: null,
          isAdmin: false,
          isLoading: false,
          role: "student",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, setUser: setAppState }}>
      <Router>
        <div
          className="App"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
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
                <Route path="/" element={<Home />} />
                {appState.user && (
                  <Route path="/userprofile" element={<UserProfile />} />
                )}
                {appState.userData && appState.userData.role === "teacher" && (
                <>
                  <Route path="/teacher" element={<TeacherProfile />} />
                  <Route path="/groups" element={<GroupManagement />} />
                  <Route path="/group/:groupId" element={<GroupDetails />} />
                  <Route path="/createquiz" element={<CreateQuiz />} />
                  <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
                  <Route
                    path="/teacherquizzes/:userName"
                    element={<TeacherQuizzes />}
                  />
                </>
              )}
                <Route path="/quiz" element={<RandomQuiz />} />
                <Route path="/userquizzes" element={<UserQuizzes />} />
                <Route path="/quizzesoverview" element={<QuizzesOverview />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
