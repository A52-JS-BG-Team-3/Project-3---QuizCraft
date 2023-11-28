import { useLocation } from 'react-router-dom';
import { Box, Heading, List, ListItem, ListIcon, Text, VStack } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';

const QuizResults = () => {
  const { state } = useLocation();
  const { userAnswers, score, questions } = state; 

  return (
    <Box bg="gray.800" p={5} rounded="md" shadow="base" maxW="2xl" mx="auto" mt={10}>
      <VStack spacing={5}>
        <Heading as="h1" size="xl" color="white" textAlign="center">Quiz Results</Heading>
        <Text fontSize="lg" color="gray.200">Here are your answers:</Text>
        <List spacing={3}>
          {questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            return (
              <ListItem key={index} fontSize="lg" display="flex" alignItems="center" color="gray.100">
                {isCorrect ? (
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                ) : (
                  <ListIcon as={CloseIcon} color="red.500" />
                )}
                <Text as="span" ml={2}>
                  Question {index + 1}: {userAnswers[index]} {isCorrect ? '' : `(Correct: ${question.correctAnswer})`}
                </Text>
              </ListItem>
            );
          })}
        </List>
        <Box pt={4}>
          <Text fontSize="2xl" color="white" textAlign="center">
            Your score: {score.toFixed(2)}/{questions.reduce((acc, question) => acc + question.score, 0).toFixed(2)}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default QuizResults;
