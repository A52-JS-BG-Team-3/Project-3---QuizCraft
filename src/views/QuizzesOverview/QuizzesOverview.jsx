import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import {
  VStack,
  Image,
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
import NeonButton from "../../components/NeonButton/NeonButton";


const neonBoxShadow = `
0 0 10px rgba(0, 255, 255, 0.8),
0 0 20px rgba(0, 255, 255, 0.8),
0 0 30px rgba(0, 255, 255, 0.8),
0 0 40px rgba(0, 255, 255, 0.8),
0 0 70px rgba(0, 255, 255, 0.8)
`;

const QuizzesOverview = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFormattedDate = (timestamp) => {
    if (!timestamp) {
      return "Not specified";
    }

    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

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

  const bgColor = useColorModeValue("#03001C");
  const headingColor = useColorModeValue("#5B8FB9");

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  return (
    <VStack spacing={8} align="stretch" >
      <Box
        bg={bgColor}
        p={10}
        boxShadow={neonBoxShadow}
        w="100%" // Set width to "100%"
        h="50vh" // Set a fixed height for the component
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(45deg, #f06, #9f6)",
            borderRadius: "10px",
          },
        }}
      >
         <Image src="src\assets\logo.png" h="60px"></Image>
        <Accordion allowMultiple textColor="#5B8FB9">
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
                <Text>Status: {quiz.status || "Not specified"}</Text>
                <Text>Active from: {getFormattedDate(quiz.startTime)}</Text>
                <Text>Active until: {getFormattedDate(quiz.endTime)}</Text> 
                <Text>Active from: Not specified</Text>

                {quiz.status !== "finished" ? (
                  // <Button as={Link} to={`/quiz/${quiz.id}`}>
                  //   Join
                  // </Button>
                 <NeonButton text="Join" href={`/quiz/${quiz.id}`}/>
                ) : (
                  <Text>This quiz has finished.</Text>
                )}
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
