import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import {
  VStack,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Link } from "react-router-dom";

const QuizzesOverview = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const quizzesRef = ref(db, "quizzes");
        const snapshot = await get(quizzesRef);
        if (snapshot.exists()) {
          const quizzesData = snapshot.val();
          const formattedQuizzes = Object.keys(quizzesData).map((key) => {
            const quiz = quizzesData[key];
            return {
              id: key,
              ...quiz,
            };
          });
          setQuizzes(formattedQuizzes);
        } else {
          console.log("No quizzes found.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  const bgColor = useColorModeValue("white", "gray.700");
  const headingColor = useColorModeValue("black", "white");

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  return (
    <VStack spacing={8} align="stretch" pt="100px">
      <Box
        bg={bgColor}
        p={10}
        borderRadius="lg"
        boxShadow="xl"
        maxW="800px"
        mx="auto"
        w="full"
      >
        <Heading color={headingColor} mb={4}>
          All Quizzes Overview
        </Heading>
        <Accordion allowMultiple>
          {quizzes.map((quiz) => (
            <AccordionItem key={quiz.id} bg={bgColor} my={2}>
              <AccordionButton _expanded={{ bg: bgColor, color: headingColor }}>
                <Box flex="1" textAlign="left">
                  {quiz.title}
                </Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
  <Text>{quiz.description}</Text>
  <Text>Created by: {quiz.createdBy}</Text>
  <Text>Category: {quiz.category}</Text>
  <Text>Time limit: {quiz.timeLimit}</Text>
  <Text>Number of questions: {quiz.questions.length}</Text>
  <Button as={Link} to={`/quiz/${quiz.id}`}>Join</Button>
</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        {quizzes.length === 0 && <Text>No quizzes to display.</Text>}
      </Box>
    </VStack>
  );
};

export default QuizzesOverview;
