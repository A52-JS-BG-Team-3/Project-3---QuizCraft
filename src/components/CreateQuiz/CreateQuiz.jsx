import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { ref, set } from "firebase/database";
import { auth, db } from "../../config/firebase-config";
import QuizForm from "../CreateQuiz/QuizForm/QuizForm";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizType, setQuizType] = useState("open");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = (newQuestion) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        alert("Please login to create a quiz.");
        return;
        }

    const newQuiz = {
      title: quizTitle,
      category: quizCategory,
      type: quizType,
      timeLimit: parseInt(timeLimit, 10),
      questions,
      createdBy: user.uid,
    };
    try {
        const newQuizRef = ref(db, 'quizzes/' + newQuiz.title);
        await set(newQuizRef, newQuiz);
        alert("Quiz created successfully!");
        setQuizTitle("");
        setQuizCategory("");
        setQuizType("open");
        setTimeLimit("");
        setQuestions([]);
      } catch (error) {
        console.error("Error saving to Realtime Database: ", error);
      }
    };

  return (
    <Box pt={{ base: "100px", md: "120px" }} px={{ base: "5", md: "10" }}>
      <form onSubmit={handleSubmit}>
      <VStack spacing={3}>
        <FormControl isRequired>
          <FormLabel htmlFor="quizTitle">Title</FormLabel>
          <Input
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            textColor={quizTitle.length > 20 ? "white" : "red.500"}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="quizCategory">Category</FormLabel>
          <Input
             id="quizCategory"
             value={quizCategory}
             onChange={(e) => setQuizCategory(e.target.value)}
             placeholder="Enter quiz category"
            textColor={quizCategory.length > 3 ? "white" : "red.500"}
          />
        </FormControl>
        <FormControl isRequired>
            <FormLabel htmlFor="quizType">Type</FormLabel>
            <Select
                id="quizType"
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                placeholder="Select quiz type"
            >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
            </Select>
        </FormControl>
        <FormControl isRequired>
            <FormLabel htmlFor="timeLimit">Time Limit</FormLabel>
            <Input
                id="timeLimit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Enter time limit"
                textColor={timeLimit.length > 0 ? "white" : "red.500"}
            />
        </FormControl>
        <QuizForm onAddQuestion={handleAddQuestion} />
        <Button colorScheme="blue" onClick={handleSubmit}>
          Create Quiz
        </Button>
      </VStack>
      {/* Display added questions */}
      {questions.map((question, index) => (
        <Box key={index}>
          <p>{question.questionText}</p>
        </Box>
      ))}
        </form>
    </Box>
  );
};

export default CreateQuiz;
