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
import { neonBoxShadowPurple } from "../BoxShadowsConts/boxshadows";

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
    const intervalId =
      timer > 0 && setInterval(() => setTimer((timer) => timer - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleAnswerSelection = (selectedAnswer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);
  };

  const handleSubmitQuiz = async () => {
    const totalScore = userAnswers.reduce((acc, userAnswer, index) => {
      return (
        acc +
        (quiz.questions[index].correctAnswer === userAnswer
          ? quiz.questions[index].score
          : 0)
      );
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
            state: {
              userAnswers,
              score: totalScore,
              questions: quiz.questions,
              message: "Score saved!",
            },
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
            state: {
              userAnswers,
              score: totalScore,
              questions: quiz.questions,
              message: "Score already saved.",
            },
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
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const userEntry = Object.values(users).find((user) => user.uid === uid);
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

  const buttonStyle = {
    size: "lg",
    width: "full",
    minWidth: "150px",
    whiteSpace: "normal",
    height: "auto",
    paddingY: "20px",
    backgroundColor: "purple.500",
    color: "white",
    fontWeight: "bold",
    borderWidth: "1px",
    borderColor: "cyan.600",
    boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1), 
              inset 0 4px rgba(255, 255, 255, 0.5), 
              0 0 10px rgba(0, 255, 255, 0.5), 
              0 0 15px rgba(0, 255, 255, 0.5), 
              0 0 20px rgba(0, 255, 255, 0.5)`,
    background: `
    linear-gradient(
      to right, 
      rgba(150, 0, 255, 0.9), 
      rgba(255, 0, 150, 0.9)
    )`,
    borderRadius: "full",
    _hover: {
      background: `
      linear-gradient(
        to right, 
        rgba(165, 0, 255, 1), 
        rgba(255, 0, 165, 1)
      )`,
      boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2), 
                inset 0 4px rgba(255, 255, 255, 0.6), 
                0 0 15px rgba(0, 255, 255, 0.6), 
                0 0 20px rgba(0, 255, 255, 0.6), 
                0 0 25px rgba(0, 255, 255, 0.6)`,
    },
    _active: {
      transform: "translateY(2px)",
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), 
                inset 0 2px rgba(255, 255, 255, 0.4), 
                0 0 8px rgba(0, 255, 255, 0.6)`,
    },
    _focus: {
      outline: "none",
      boxShadow: `0 0 0 3px rgba(0, 255, 255, 0.5)`,
    },
  };

  const nextButtonStyle = {
    backgroundColor: "#FFFF66",
    color: "black",
    opacity: 0.8,
    boxShadow: "0 0 5px #FFFF66, 0 0 10px #FFFF66",
    _hover: {
      opacity: 1,
      boxShadow: "0 0 10px #FFFF66, 0 0 20px #FFFF66, 0 0 30px #FFFF66",
    },
    _active: {
      transform: "scale(0.98)",
    },
    _focus: {
      outline: "none",
    },
    mt: 4,
  };
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Container
        maxW="container.md"
        pt={{ base: 2, md: 8 }}
        pb={{ base: 2, md: 8 }}
      >
        <VStack spacing={{ base: 1, md: 4 }} align="center" justify="center">
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
              sx={{ color: "white", mt: { base: "2", md: "-4" } }}
            >
              Time Remaining: {formatTime(timer)}
            </Text>
          )}
          <Box
            boxShadow={neonBoxShadowPurple}
            pt={{ base: 4, md: 8 }}
            pb={{ base: 4, md: 8 }}
            px={{ base: 5, md: 8 }}
            width="full"
            borderRadius={15}
            transform="translateY(10px)" 
          >
            <Text fontSize="2xl" color="white" mb={4} textAlign="center">
              {currentQuestion.questionText}
            </Text>
            <SimpleGrid
              columns={2}
              spacing={4}
              justifyItems="center"
              alignItems="center"
            >
              {["optionA", "optionB", "optionC", "optionD"].map((optionKey) => (
                <Button
                  key={optionKey}
                  onClick={() =>
                    handleAnswerSelection(currentQuestion[optionKey])
                  }
                  {...buttonStyle}
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
              onClick={() =>
                setCurrentQuestionIndex((currentIndex) => currentIndex + 1)
              }
              {...nextButtonStyle}
              mt={4}
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
