import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { auth, db } from "../../config/firebase-config";
import {
  Box,
  Button,
  Text,
  VStack,
  Container,
  Heading,
  SimpleGrid,
  ChakraProvider,
  extendTheme,
  Image,
} from "@chakra-ui/react";
import { CSSReset } from "@chakra-ui/react";
import QuizGamePicture from "../../assets/quiz_game.png";
import { useToast } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Roboto, sans-serif",
    body: "Roboto, sans-serif",
  },
});

const QuizPlayer = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState("");
  const [offsetY] = useState(0);

  const toast = useToast();
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      const quizRef = ref(db, `quizzes/${quizId}`);
      try {
        const snapshot = await get(quizRef);
        if (snapshot.exists()) {
          const quizData = snapshot.val();
          setQuiz(quizData);
          setUserAnswers(new Array(quizData.questions.length).fill(null));
          if (quizData.timeLimit) {
            setTimer(quizData.timeLimit * 60);
          }
        } else {
          setError("Quiz not found");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Failed to fetch quiz data");
      }
    };
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmitQuiz();
    }
    const intervalId = timer > 0 && setInterval(() => setTimer((timer) => timer - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleAnswerSelection = (selectedAnswer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);
  };

  const handleSubmitQuiz = async () => {
    const totalScore = userAnswers.reduce((acc, userAnswer, index) => {
      return acc + (quiz.questions[index].correctAnswer === userAnswer ? quiz.questions[index].score : 0);
    }, 0);

    const user = auth.currentUser;
    if (user) {
      const userName = await fetchUserName(user.uid);
      const attemptedRef = ref(db, `attempted/${userName}/${quizId}`);
      try {
        const snapshot = await get(attemptedRef);
        if (!snapshot.exists()) {
          const currentTime = new Date().getTime(); 
          await set(attemptedRef, {
            title: quiz.title,
            score: totalScore,
            attemptedAt: currentTime,
          });
          toast({
            title: "Quiz Completed",
            description: "Your score has been saved!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          navigate(`/quiz/${quizId}/results`, {
            state: { userAnswers, score: totalScore, questions: quiz.questions, message: 'Score saved!' },
          });
        } else {
          toast({
            title: "Quiz Already Attempted",
            description: "Your score has already been recorded for this quiz.",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
          navigate(`/quiz/${quizId}/results`, {
            state: { userAnswers, score: totalScore, questions: quiz.questions, message: 'Score already saved.' },
          });
        }
      } catch (error) {
        console.error("Error when submitting quiz:", error);
        setError("Failed to submit quiz");
      }
    } else {
      setError("User must be logged in to submit quiz");
    }
  };

  const fetchUserName = async (uid) => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const userEntry = Object.values(users).find(user => user.uid === uid);
      return userEntry ? userEntry.userName : null;
    } else {
      setError("No user data found.");
      return null;
    }
  };

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!quiz) {
    return <Box>Loading...</Box>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const neonBorderStyle = {
    border: "2px solid",
    borderColor: "cyan.400",
    boxShadow: "0 0 10px cyan",
    rounded: "lg",
    p: 5,
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Container
        maxW="container.md"
        pt={{ base: 2, md: 8 }}
        pb={{ base: 2, md: 8 }}
      >
        <VStack spacing={{ base: 1, md: 4 }} align="stretch">
          <Image
            src={QuizGamePicture}
            alt="quiz game"
            mx="auto"
            w="60%"
            transform={`translateY(${offsetY * 0.5}px)`}
            transition="transform 0.2s"
            _hover={{
              transform: `translateY(${offsetY * 0.5}px) scale(1.05)`,
            }}
          />
          <Heading
            as="h2"
            fontFamily="Lobster"
            textAlign="center"
            sx={{
              color: "white",
              mt: { base: "-2", md: "-4" },
              mb: { base: 2, md: 4 },
            }}
          >
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Heading>
          {timer !== null && (
            <Text
              fontSize="xl"
              fontFamily="Lobster"
              textAlign="center"
              sx={{ color: "white", mt: { base: "-2", md: "-4" } }}
            >
              Time Remaining: {formatTime(timer)}
            </Text>
          )}
          <Box {...neonBorderStyle}>
            <Text fontSize="2xl" color="white" mb={4}>
              {currentQuestion.questionText}
            </Text>
            <SimpleGrid columns={2} spacing={4}>
              {["optionA", "optionB", "optionC", "optionD"].map((optionKey) => (
                <Button
                  key={optionKey}
                  onClick={() => handleAnswerSelection(currentQuestion[optionKey])}
                  colorScheme={userAnswers[currentQuestionIndex] === currentQuestion[optionKey] ? "green" : "orange"}
                  variant="outline"
                  size="lg"
                  width="full"
                  {...neonBorderStyle}
                >
                  {currentQuestion[optionKey]}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button colorScheme="green" onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button
              backgroundColor="#FFFF66"
              color="clear"
              opacity={0.8}
              onClick={() => setCurrentQuestionIndex((currentIndex) => currentIndex + 1)}
            >
              Next Question
            </Button>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default QuizPlayer;
