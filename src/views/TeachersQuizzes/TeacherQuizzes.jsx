import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ref, get, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";
import NeonButton from "../../components/NeonButton/NeonButton";

const TeacherQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const { userName } = useParams();

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const quizzesRef = ref(db, "quizzes");
        const snapshot = await get(quizzesRef);
        if (snapshot.exists()) {
          const quizzesData = snapshot.val();

          const userQuizzes = Object.keys(quizzesData)
            .filter((key) => quizzesData[key].createdBy === userName)
            .map((key) => ({
              id: key,
              ...quizzesData[key],
            }));
          setQuizzes(userQuizzes);
        } else {
          console.log("No quizzes found.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (userName) {
      fetchUserQuizzes();
    }
  }, [userName]);

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      await remove(quizRef);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <VStack spacing={8} align="center" px={{ base: "5", md: "10" }}>
      <Text color="#FFFFC7" fontSize="xl" fontWeight="bold" mb={4}>
        {`${userName}'s Quizzes`}
      </Text>
      {quizzes.length > 0 ? (
        <HStack spacing={4} align="stretch" >
          {quizzes.map((quiz) => (
            <Box
              key={quiz.id}
              p={4}
              bg="#03001C"
              borderRadius="md"
              boxShadow={neonBoxShadowPurple}
              textColor="#5B8FB9"
            >
              <Text fontWeight="bold" mb={2}>
                {quiz.title}
              </Text>
              <Text>{quiz.description}</Text>
              <Text>Created by: {quiz.createdBy}</Text>
              <Text>Category: {quiz.category}</Text>
              <Text>Time limit: {quiz.timeLimit}</Text>
              <Text>Number of questions: {quiz.questions.length}</Text>
              <Box mt={4} display="flex" justifyContent="space-between">
                <NeonButton text="Edit Quiz" onClick={() => handleEditQuiz(quiz.id)} />
                <NeonButton text="Delete Quiz" onClick={() => handleDeleteQuiz(quiz.id)} />
              </Box>
            </Box>
          ))}
        </HStack>
      ) : (
        <Text color="white">No quizzes to display.</Text>
      )}
    </VStack>
  );
};

TeacherQuizzes.propTypes = {
  userName: PropTypes.string,
};

export default TeacherQuizzes;
