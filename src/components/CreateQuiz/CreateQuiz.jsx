import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ref, set, push } from "firebase/database";
import { auth, db } from "../../config/firebase-config";
import QuizForm from "../CreateQuiz/QuizForm/QuizForm";
import { useNavigate } from "react-router-dom";


const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizType, setQuizType] = useState("open");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const handleAddQuestion = (newQuestion) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    toast({
      title: "Question added.",
      description: "You've successfully added a new question.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
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
      questions: questions.map((q) => ({
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
      })),
      createdBy: user.uid,
    };
    try {
      const quizzesRef = ref(db, "quizzes");
      const newQuizRef = push(quizzesRef);
      await set(newQuizRef, newQuiz);
      newQuiz.id = newQuizRef.key;
      alert("Quiz created successfully with ID: " + newQuizRef.key);
      setQuizTitle("");
      setQuizCategory("");
      setQuizType("open");
      setTimeLimit("");
      setQuestions([]);
      navigate(`/edit-quiz/${newQuizRef.key}`);
    } catch (error) {
      console.error("Error saving to Realtime Database: ", error);
    }
  };

  return (
    <Box pt={{ base: "100px", md: "100px" }} px={{ base: "5", md: "10" }}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          <FormControl isRequired>
            <FormLabel htmlFor="quizTitle" color={"white"}>
              Title
            </FormLabel>
            <Input
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              textColor={quizTitle.length > 20 ? "white" : "red.500"}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="quizCategory" color={"white"}>
              Category
            </FormLabel>
            <Input
              id="quizCategory"
              value={quizCategory}
              onChange={(e) => setQuizCategory(e.target.value)}
              placeholder="Enter quiz category"
              textColor={quizCategory.length > 3 ? "white" : "red.500"}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="quizType" color={"white"}>
              Type
            </FormLabel>
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
            <FormLabel htmlFor="timeLimit" color={"white"}>
              Time Limit
            </FormLabel>
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
