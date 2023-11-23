import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, ref, update, remove } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { Box, Button, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react';

const EditQuiz = () => {
  const [quiz, setQuiz] = useState({ questions: [] });
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizRef = ref(db, `quizzes/${quizId}`);
      const snapshot = await get(quizRef);
      if (snapshot.exists()) {
        setQuiz(snapshot.val());
      } else {
        console.log("Quiz not found.");
        navigate('/userquizzes'); // Redirect if quiz not found
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuiz = {...quiz};
    updatedQuiz.questions[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleUpdateQuiz = async () => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      await update(quizRef, quiz);
      alert('Quiz updated successfully!');
    } catch (error) {
      console.error("Error updating quiz: ", error);
      alert('Failed to update quiz.');
    }
  };
  
  const handleDeleteQuiz = async () => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      // Use remove method to delete the quiz
      await remove(quizRef);
      alert('Quiz deleted successfully!');
      navigate('/userquizzes');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz.');
    }
  };

  if (loading) return <p>Loading quiz...</p>;

  return (
    <Flex align="center" justify="center" pt={{ base: "100px", md: "120px" }}>
      <Box bg="white" p={5} borderRadius="lg" boxShadow="xl">
        <h1>Edit Quiz</h1>
        {quiz && quiz.questions && quiz.questions.map((question, index) => (
          <FormControl key={index} my={4}>
            <FormLabel>Question {index + 1}</FormLabel>
            <Input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
            />
            <FormLabel>Answer A</FormLabel>
            <Input
              type="text"
              value={question.optionA}
              onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
            />
            <FormLabel>Answer B</FormLabel>
            <Input
              type="text"
              value={question.optionB}
              onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
            />
            <FormLabel>Answer C</FormLabel>
            <Input
              type="text"
              value={question.optionC}
              onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
            />
            <FormLabel>Answer D</FormLabel>
            <Input
              type="text"
              value={question.optionD}
              onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)}
            />
            <FormLabel>Correct Answer</FormLabel>
            <Input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
            />
            <Button onClick={() => handleUpdateQuiz()} colorScheme="blue" mt={4}>
              Save Changes
            </Button>
            <Button onClick={() => handleDeleteQuiz()} colorScheme="red" mt={4} ml={4}>
              Delete Quiz
            </Button>
          </FormControl>
        ))}
      </Box>
    </Flex>
  );
};

export default EditQuiz;
