import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, ref, update, remove } from "firebase/database";
import { db } from "../../../config/firebase-config";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Select,
  Divider,
  Heading,
  Text,
  Radio,
  RadioGroup,
  HStack,
  
} from "@chakra-ui/react";

const EditQuiz = () => {
  const [quiz, setQuiz] = useState({ questions: [] });
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState(quiz.status || 'ongoing');
  const [startTime, setStartTime] = useState(quiz.startTime || '');
  const [endTime, setEndTime] = useState(quiz.endTime || '');

  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizRef = ref(db, `quizzes/${quizId}`);
      const snapshot = await get(quizRef);
      if (snapshot.exists()) {
        setQuiz(snapshot.val());
      } else {
        navigate("/userquizzes"); 
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleCorrectAnswerChange = (index, selectedOptionLetter) => {
    const updatedQuiz = { ...quiz };
    const correctAnswerValue = updatedQuiz.questions[index][`option${selectedOptionLetter}`];
    updatedQuiz.questions[index].correctAnswer = correctAnswerValue;
    setQuiz(updatedQuiz);
  };
  
  const handleUpdateQuiz = async () => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      await update(quizRef, { ...quiz, status: quizStatus });
      alert("Quiz updated successfully!");
      navigate("/userquizzes");
    } catch (error) {
      console.error("Error updating quiz: ", error);
      alert("Failed to update quiz.");
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      await remove(quizRef);
      alert("Quiz deleted successfully!");
      navigate("/userquizzes");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz.");
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions.splice(index, 1);
    setQuiz(updatedQuiz);
  };

  const handleAddQuestion = () => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions.push({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    });
    setQuiz(updatedQuiz);
  };

  if (loading) return <p>Loading quiz...</p>;

  return (
    <Flex align="center" justify="center" pt={{ base: "100px", md: "850px" }}>
      <Box bg="white" p={5} borderRadius="lg" boxShadow="xl">
      <Heading as="h1" size="xl" color="blue.600" mb={4}>Edit Quiz</Heading>
        <Divider my={4} />
        <FormControl>
        <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={2}>Status</Text>
  <Select value={quizStatus} onChange={(e) => setQuizStatus(e.target.value)}>
    <option value="ongoing">Ongoing</option>
    <option value="finished">Finished</option>
  </Select>
</FormControl>
<FormControl>
  <FormLabel>Start Time</FormLabel>
  <Input
    type="datetime-local"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
  />
</FormControl>

<FormControl>
  <FormLabel>End Time</FormLabel>
  <Input
    type="datetime-local"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
  />
  <Divider my={4} />
</FormControl>
        {quiz &&
          quiz.questions &&
          quiz.questions.map((question, index) => (
            <FormControl key={index} my={4}>
              <FormLabel htmlFor={`questionText-${index}`}>
                Question {index + 1}
              </FormLabel>

              <Input
                id={`questionText-${index}`}
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
              />
              <FormLabel htmlFor={`optionA-${index}`}>Answer A</FormLabel>
              <Input
                id={`optionA-${index}`}
                type="text"
                value={question.optionA}
                onChange={(e) =>
                  handleQuestionChange(index, "optionA", e.target.value)
                }
              />
              <FormLabel htmlFor={`optionB-${index}`}>Answer B</FormLabel>
              <Input
                id={`optionB-${index}`}
                type="text"
                value={question.optionB}
                onChange={(e) =>
                  handleQuestionChange(index, "optionB", e.target.value)
                }
              />
              <FormLabel htmlFor={`optionC-${index}`}>Answer C</FormLabel>
              <Input
                id={`optionC-${index}`}
                type="text"
                value={question.optionC}
                onChange={(e) =>
                  handleQuestionChange(index, "optionC", e.target.value)
                }
              />
              <FormLabel htmlFor={`optionD-${index}`}>Answer D</FormLabel>
              <Input
                id={`optionD-${index}`}
                type="text"
                value={question.optionD}
                onChange={(e) =>
                  handleQuestionChange(index, "optionD", e.target.value)
                }
              />
              <FormControl as="fieldset">

              <FormLabel htmlFor={`correctAnswer-${index}`}>
      Correct Answer
    </FormLabel>
          <Input 
            id={`correctAnswer-${index}`}
            type="text"
            value={question.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(index, "correctAnswer", e.target.value)
            }
          />

    <RadioGroup
      name={`correctAnswer-${index}`}
      value={question.correctAnswer}
      onChange={(selectedLetter) => handleCorrectAnswerChange(index, selectedLetter)}
    >
      <HStack spacing="24px">
        {["A", "B", "C", "D"].map((option) => (
          <Radio key={option} value={option}>
            {option}
          </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </FormControl>
          
              <Button
                onClick={() => handleDeleteQuestion(index)}
                colorScheme="red"
                mt={4}
                ml={4}
                size={'sm'}
              >
                Delete Question
              </Button>
            </FormControl>
          ))}
          <Button 
                onClick={() => handleAddQuestion()}
                colorScheme="green"
                mt={4}
                ml={4}
                size={'sm'}
              >
                Add Question
              </Button>
          <Button
                onClick={() => handleUpdateQuiz()}
                colorScheme="blue"
                mt={4}
                ml={4}
                size={'sm'}
              >
                Save Changes
              </Button>
           <Button
                onClick={() => handleDeleteQuiz()}
                colorScheme="red"
                mt={4}
                ml={4}
                size={'sm'}
              >
                Delete Quiz
              </Button>
      </Box>
    </Flex>
  );
};

export default EditQuiz;
