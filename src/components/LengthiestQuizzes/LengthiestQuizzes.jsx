import { useEffect, useState, useContext } from "react";
import { ref, get, query, orderByChild, limitToLast } from "firebase/database";
import { db } from "../../config/firebase-config";
import { Box, Flex, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AppContext from "../../context/context"; // Assuming your user context

const neonBoxShadow = `
0 0 10px rgba(0, 255, 255, 0.8),
0 0 20px rgba(0, 255, 255, 0.8),
0 0 30px rgba(0, 255, 255, 0.8),
0 0 40px rgba(0, 255, 255, 0.8),
0 0 70px rgba(0, 255, 255, 0.8)
`;

const quizCardStyles = {
  border: "solid #301E67",
  borderRadius: "8px",
  p: 4,
  mb: 4,
  w: "100%",
};

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
      const sortedQuizzes = Object.values(quizzesData).sort(
        (a, b) => parseInt(b.timeLimit) - parseInt(a.timeLimit)
      );

      setQuizzes(sortedQuizzes);
    });
  }, []);

  return (
    <Box
    bg="#03001C"
    p={4}
    mb={4}
    boxShadow={neonBoxShadow}
    width="100%"
    maxWidth={{ base: "100%", md: "xl" }}
    mx="auto"
  >
      <Heading color="#FFFFC7" mb={4} fontSize={{ base: "xl", md: "2xl" }}>
        Our Lengthiest Quizzes
      </Heading>
      <Flex justifyContent="center">
        <VStack align="start" textColor="#5B8FB9" w="100%">
          {quizzes &&
            quizzes.map((quiz, index) => (
              <Box key={quiz.id} {...quizCardStyles}>
                {user ? (
                  <Link to={`quizzesoverview`}>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      {`${index + 1}. ${quiz.title}`}
                    </Text>
                    <Text>{`Time Limit: ${quiz.timeLimit} minutes`}</Text>
                  </Link>
                ) : (
                  <>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      {`${index + 1}. ${quiz.title}`}
                    </Text>
                    <Text>{`Time Limit: ${quiz.timeLimit} minutes`}</Text>
                  </>
                )}
              </Box>
            ))}
        </VStack>
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
