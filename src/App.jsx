import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { auth, db } from "./config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { fetchUserName } from "./services/user.service";
// import { useContext } from "react";
import AppContext from "./context/context";
import WithSubnavigation from "./components/NavBar/NavBar";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import Login from "./views/LogIn/Login";
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
import QuizPlayer from "./components/QuizPlayer/QuizPlayer";
import QuizResults from "./components/QuizRezults/QuizResults";
import AdminPanel from "./views/AdminPanel/AdminPanel";
import StudentsProfile from "./views/StudentsProfile/StudentsProfile";
import StudentResults from "./views/TeacherProfile/StudentResults";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isAdmin: false,
    isLoading: true,
    role: null,
  });
  // const { user, userData } = useContext(AppContext);

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

  const isAuthenticated = appState.user !== null;
  const isAdmin = isAuthenticated && appState.isAdmin;

  return (
    <AppContext.Provider value={{ ...appState, setUser: setAppState }}>
      <Router>
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          height="100vh"
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
                    <Route
                      path="/quizresults/:userName/"
                      element={<StudentResults />}
                    />
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
                {appState.userData && appState.userData.role === "student" && (
                  <>
                    <Route path="/student" element={<StudentsProfile />} />
                  </>
                )}
                {isAuthenticated && isAdmin ? (
                  <Route path="/adminpanel" element={<AdminPanel />} />
                ) : (
                  <Route path="/adminpanel" element={<Navigate to="/" />} />
                )}
                <Route path="/userquizzes" element={<UserQuizzes />} />
                <Route path="/quizzesoverview" element={<QuizzesOverview />} />
                <Route path="/quiz/:quizId" element={<QuizPlayer />} />
                <Route path="/quiz/:quizId/results" element={<QuizResults />} />
              </Routes>
            </>
          )}
        </Flex>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
