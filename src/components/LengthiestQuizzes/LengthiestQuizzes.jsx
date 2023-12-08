import { useEffect, useState, useContext } from "react";
import { ref, get, query, orderByChild, limitToLast } from "firebase/database";
import { db } from "../../config/firebase-config";
import { Box, Flex, HStack, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AppContext from "../../context/context"; // Assuming your user context
import { neonBoxShadowTurquoise } from "../BoxShadowsConts/boxshadows";
import NeonButton from "../NeonButton/NeonButton";

export default function LengthiestQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const { user } = useContext(AppContext); // Assuming your user context provides user information

  useEffect(() => {
    const quizzesRef = ref(db, "quizzes");
    const latestQuizzesQuery = query(
      quizzesRef,
      orderByChild("timeLimit"),
      limitToLast(3)
    );

    get(latestQuizzesQuery).then((snapshot) => {
      const quizzesData = snapshot.val();
      const sortedQuizzes = Object.values(quizzesData)
        .filter((quiz) => quiz.type === "closed")
        .sort((a, b) => parseInt(b.timeLimit) - parseInt(a.timeLimit))
        .slice(0, 3); 

      setQuizzes(sortedQuizzes);
    });
  }, []);

  return (
    <Box
      bg="#03001C"
      p={4}
      mb={4}
      boxShadow={neonBoxShadowTurquoise}
      textColor="#5B8FB9"
      maxW="80%"
      mx="auto"
    >
      <Heading color="#FFFFC7" mb={4} fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
        Our Lengthiest Quizzes
      </Heading>
      <Flex justifyContent="center">
        <HStack align="start" textColor="#5B8FB9" w="100%">
          {quizzes &&
            quizzes.map((quiz, index) => (
              <Box
                key={quiz.id}
                p={4}
                bg="#1A1A1D"
                borderRadius="md"
                textAlign="center"
                border="solid"
                borderColor="#301E67"
              >
                <Text fontSize="sm" fontWeight="bold" color="#5B8FB9">
                  {quiz.title}
                </Text>
                <Text fontSize="xs" color="#5B8FB9">
                  {quiz.category}
                </Text>
                <Text fontSize="xs" color="#5B8FB9">
                  {quiz.createdBy}
                </Text>
                <Text fontSize="xs" color="#5B8FB9">
                  {quiz.timeLimit} minutes
                </Text>
                {user && quiz.status !== "closed" ? (
                  <NeonButton text="Join" href={`/quiz/${quiz.id}`} />
                ) : (
                  <Text textColor="#5B8FB9">This quiz has finished.</Text>
                )}
              </Box>
            ))}
        </HStack>
      </Flex>
      {!user && (
        <Text mt={4} textAlign="center">
          <Button
            as={Link}
            to="/signin"
            color="#5B8FB9"
            variant="link"
            fontSize="large"
          >
            Sign in to try them
          </Button>
        </Text>
      )}
    </Box>
  );
}
