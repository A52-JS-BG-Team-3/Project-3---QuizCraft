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
import { ref, set, push, get } from "firebase/database";
import { auth, db } from "../../config/firebase-config";
import QuizForm from "../CreateQuiz/QuizForm/QuizForm";
import { useNavigate } from "react-router-dom";
import { combinedQuizCategories } from "../../utils/combinedQuizCategories";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizType, setQuizType] = useState("open");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const currentTime = new Date().getTime();
  const isQuizFinished = endTime && currentTime > new Date(endTime).getTime();

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

  const handleCategorySelect = (selectedCategory) => {
    setQuizCategory(selectedCategory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quizTitle.length < 3 || quizTitle.length > 30) {
      alert("Quiz title must be between 3 and 30 characters.");
      return;
    }

    const scorePerQuestion = 100 / questions.length;

    const user = auth.currentUser;

    if (!user) {
      alert("Please login to create a quiz.");
      return;
    }

    const fetchUserName = async (uid) => {
      const usersRef = ref(db, `users`);
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let userName = "Anonymous";
        const usersData = snapshot.val();
        Object.keys(usersData).forEach((userKey) => {
          if (usersData[userKey].uid === uid) {
            userName = usersData[userKey].userName;
          }
        });
        return userName;
      } else {
        console.log("No users found in the database.");
        return userName;
      }
    };

    const userName = await fetchUserName(user.uid);

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
        score: scorePerQuestion,
      })),
      createdBy: userName,
      creatorUid: user.uid,
      startTime: startTime ? new Date(startTime).getTime() : null,
      endTime: endTime ? new Date(endTime).getTime() : null,
      status: isQuizFinished ? "finished" : "ongoing",
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
      navigate(`/userquizzes`);
    } catch (error) {
      console.error("Error saving to Realtime Database: ", error);
    }
  };

  return (
    <Box pt={{ base: "100px", md: "800px" }} px={{ base: "5", md: "10" }}>
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
              textColor={3 < quizTitle.length < 30 ? "white" : "red.500"}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="quizCategory" color={"white"}>Category</FormLabel>
            <Select
              id="quizCategory"
              value={quizCategory}
              onChange={(e) => setQuizCategory(e.target.value)}
              placeholder="Select quiz category"
              color={"white"}
              bg="transparent" 
                borderRadius="md" 
                borderColor="gray.200" 
                _focus={{ borderColor: "blue.300" }}
            >
              {combinedQuizCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Select>
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
            <FormControl>
  <FormLabel htmlFor="startTime" color={"white"}>Start Time</FormLabel>
  <Input
    id="startTime"
    type="datetime-local"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
  />
</FormControl>

<FormControl>
  <FormLabel htmlFor="endTime" color={"white"}>End Time</FormLabel>
  <Input
    id="endTime"
    type="datetime-local"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
  />
</FormControl>

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
        {questions.map((question, index) => (
          <Box key={index} bg="#03001C" textColor="#5B8FB9">
            <p>{question.questionText}</p>
          </Box>
        ))}
      </form>
    </Box>
  );
};

export default CreateQuiz;
