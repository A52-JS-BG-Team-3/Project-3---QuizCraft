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
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { neonBoxShadowPurple } from "../../BoxShadowsConts/boxshadows";
import NeonButton from "../../NeonButton/NeonButton";

const EditQuiz = () => {
  const [quiz, setQuiz] = useState({ questions: [] });
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState(quiz.status || "ongoing");
  const [startTime, setStartTime] = useState(quiz.startTime || "");
  const [endTime, setEndTime] = useState(quiz.endTime || "");

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
    const correctAnswerValue =
      updatedQuiz.questions[index][`option${selectedOptionLetter}`];
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
      <Box bg="#03001C" p={5} borderRadius="lg" boxShadow={neonBoxShadowPurple}>
        <Heading as="h1" size="xl" mb={4} textColor="#FFFFC7">
          Edit Quiz
        </Heading>
        <Divider my={4} />
        <FormControl>
          <Text fontSize="lg" fontWeight="bold" textColor="#5B8FB9" mb={2}>
            Status
          </Text>
          <Select
            value={quizStatus}
            onChange={(e) => setQuizStatus(e.target.value)}
            textColor="black"
            bg="#B6EADA"
          >
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel textColor="#5B8FB9">Start Time</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            bg="#B6EADA"
          />
        </FormControl>
        <FormControl>
          <FormLabel textColor="#5B8FB9">End Time</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            bg="#B6EADA"
          />
          <Divider my={4} />
        </FormControl>
        <Table variant="striped" colorScheme="black">
          <Thead>
            <Tr>
              <Th textColor="#5B8FB9">Question</Th>
              <Th textColor="#5B8FB9">Answer A</Th>
              <Th textColor="#5B8FB9">Answer B</Th>
              <Th textColor="#5B8FB9">Answer C</Th>
              <Th textColor="#5B8FB9">Answer D</Th>
              <Th textColor="#5B8FB9">Correct Answer</Th>
              <Th textColor="#5B8FB9">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quiz &&
              quiz.questions &&
              quiz.questions.map((question, index) => (
                <Tr key={index} textColor="#5B8FB9">
                  <Td>
                    <Input
                      type="text"
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "questionText",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={question.optionA}
                      onChange={(e) =>
                        handleQuestionChange(index, "optionA", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={question.optionB}
                      onChange={(e) =>
                        handleQuestionChange(index, "optionB", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={question.optionC}
                      onChange={(e) =>
                        handleQuestionChange(index, "optionC", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={question.optionD}
                      onChange={(e) =>
                        handleQuestionChange(index, "optionD", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                    />
                    <RadioGroup
                      name={`correctAnswer-${index}`}
                      value={question.correctAnswer}
                      onChange={(selectedLetter) =>
                        handleCorrectAnswerChange(index, selectedLetter)
                      }
                    >
                      <HStack spacing="24px">
                        {["A", "B", "C", "D"].map((option) => (
                          <Radio key={option} value={option}>
                            {option}
                          </Radio>
                        ))}
                      </HStack>
                    </RadioGroup>
                  </Td>
                  <Td>
                    
                    <NeonButton 
                    onClick={() => handleDeleteQuestion(index)}
                    text="Delete"
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <NeonButton onClick={() => handleUpdateQuiz()} text="Save Changes" />
        <NeonButton onClick={() => handleDeleteQuiz()} text="Delete Quiz" />
        <NeonButton onClick={() => handleAddQuestion()} text="Add Question" />
      </Box>
    </Flex>
  );
};

export default EditQuiz;
