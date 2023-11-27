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
  Stack,
} from '@chakra-ui/react';

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
          setUserAnswers(new Array(quizData.questions.length).fill(null)); // Initialize with null
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

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="yellow.300">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Heading>
        {timer !== null && (
          <Text fontSize="xl" color="yellow.300" textAlign="center">
            Time Remaining: {formatTime(timer)}
          </Text>
        )}
        <Box p={5} bg="blue.900" rounded="md" shadow="base">
          <Text fontSize="2xl" color="yellow.300" mb={4}>{currentQuestion.questionText}</Text>
          <Stack direction="column" spacing={4}>
            {['optionA', 'optionB', 'optionC', 'optionD'].map((optionKey) => (
              <Button
                key={optionKey}
                onClick={() => handleAnswerSelection(currentQuestion[optionKey])}
                colorScheme="yellow"
                variant="solid"
                size="lg"
                width="full"
              >
                {currentQuestion[optionKey]}
              </Button>
            ))}
          </Stack>
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
  );
};

export default QuizPlayer;
