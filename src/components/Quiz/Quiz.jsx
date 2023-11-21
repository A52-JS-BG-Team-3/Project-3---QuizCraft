import { useState, useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const Quiz = () => {
  const [questions, setQuestions] = useState(null); // Инициализирайте с null
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  if (!questions) { // Проверка дали въпросите са заредени
    return <Text>Loading questions...</Text>;
  }

  const handleAnswer = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <Box>
      {quizFinished ? (
        <Text>Congratulations, you have finished the quiz! Your score: {score}</Text>
      ) : (
        <Box>
          <Text>{questions[currentQuestionIndex].question}</Text>
            {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer)
              .sort(() => Math.random() - 0.5)
              .map((answer, index) => (
                <Button key={index} onClick={() => handleAnswer(answer)} m={2}>
                  {answer}
                </Button>
              ))}
          </Box>
      )}
    </Box>
  );
};

export default Quiz;
