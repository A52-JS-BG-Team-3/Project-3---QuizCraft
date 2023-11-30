import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase-config';
import {
  Box,
  Button,
  Text,
  VStack,
  Container,
  Heading,
  SimpleGrid,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import { CSSReset } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
});

const QuizPlayer = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState('');

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
          setError('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setError('Failed to fetch quiz data');
      }
    };
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmitQuiz();
    }
    const intervalId = timer > 0 && setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleAnswerSelection = (selectedAnswer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);
  };

  const handleSubmitQuiz = () => {
    const totalScore = userAnswers.reduce((acc, userAnswer, index) => {
      if (quiz.questions[index].correctAnswer === userAnswer) {
        return acc + quiz.questions[index].score;
      }
      return acc;
    }, 0);

    navigate(`/quiz/${quizId}/results`, {
      state: { userAnswers, score: totalScore, questions: quiz.questions },
    });
  };

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!quiz) {
    return <Box>Loading...</Box>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const neonBorderStyle = {
    border: '2px solid',
    borderColor: 'cyan.400',
    boxShadow: '0 0 10px cyan',
    rounded: 'lg',
    p: 5,
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" sx={{ color: 'white' }}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Heading>
          {timer !== null && (
            <Text fontSize="xl" textAlign="center" sx={{ color: 'white' }}>
              Time Remaining: {formatTime(timer)}
            </Text>
          )}
          <Box
            border="2px solid"
            borderColor="cyan.400"
            boxShadow="0 0 10px cyan"
            rounded="lg"
            p={5}
            sx={{ color: 'white' }}
          >
            <Text fontSize="2xl" mb={4}>{currentQuestion.questionText}</Text>
            <SimpleGrid columns={2} spacing={4}>
            {['optionA', 'optionB', 'optionC', 'optionD'].map((optionKey) => (
              <Button
                key={optionKey}
                onClick={() => handleAnswerSelection(currentQuestion[optionKey])}
                colorScheme={userAnswers[currentQuestionIndex] === currentQuestion[optionKey] ? "green" : "yellow"}
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
          <Button colorScheme="green" onClick={handleSubmitQuiz}>Submit Quiz</Button>
        ) : (
          <Button colorScheme="teal" onClick={() => setCurrentQuestionIndex(currentIndex => currentIndex + 1)}>
            Next Question
          </Button>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default QuizPlayer;
