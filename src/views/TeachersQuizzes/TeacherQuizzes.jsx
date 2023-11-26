import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

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

  return (
    <Box pt={{ base: "5px", md: "10px" }} px={{ base: "5", md: "10" }}>
      <VStack spacing={8} align={"center"}>
        <Text color="white" fontSize="xl" fontWeight="bold" mb={4}>
          {`${userName}'s Quizzes`}
        </Text>
        {quizzes.length > 0 ? (
          <Accordion allowMultiple>
            {quizzes.map((quiz) => (
              <AccordionItem key={quiz.id} my={2}>
                <AccordionButton>
                  <Box flex="1" textAlign="left" color="white">
                    {quiz.title}
                  </Box>
                </AccordionButton>
                <AccordionPanel pb={4} color={"white"}>
                  <Text>{quiz.description}</Text>
                  <Text>Created by: {quiz.createdBy}</Text>
                  <Text>Category: {quiz.category}</Text>
                  <Text>Time limit: {quiz.timeLimit}</Text>
                  <Text>Number of questions: {quiz.questions.length}</Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleEditQuiz(quiz.id)}
                  >
                    Edit Quiz
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Text color="white">No quizzes to display.</Text>
        )}
      </VStack>
    </Box>
  );
};

TeacherQuizzes.propTypes = {
  userName: PropTypes.string,
};

export default TeacherQuizzes;
