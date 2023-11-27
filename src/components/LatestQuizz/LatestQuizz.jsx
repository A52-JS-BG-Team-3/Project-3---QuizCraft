import { useEffect, useState } from "react";
import { ref, get, query, orderByKey, limitToLast } from "firebase/database";
import { db } from "../../config/firebase-config";
import { Box, Flex, VStack, Heading, Text } from "@chakra-ui/react";

const neonBoxShadow = `
  0 0 10px rgba(2, 900, 1, 0.8),
  0 0 20px rgba(2, 900, 1, 0.8),
  0 0 30px rgba(2, 900, 1, 0.8),
  0 0 40px rgba(2, 900, 1, 0.8),
  0 0 70px rgba(2, 900, 1, 0.8)
`;

export default function LatestQuizz() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const quizzesRef = ref(db, "quizzes");
    const latestQuizzesQuery = query(
      quizzesRef,
      orderByKey("timeLimit"),
      limitToLast(5)
    );

    get(latestQuizzesQuery).then((snapshot) => {
      const quizzesData = snapshot.val();
      setQuizzes(quizzesData);
    });
  }, []);

  return (
    <Box
      bg="#03001C"
      boxS
      p={4}
      mb={4}
      boxShadow={neonBoxShadow}
    >
      <Heading color="#5B8FB9" mb={4} fontSize="xl">
        Our Lengthiest Quizzes
      </Heading>
      <Flex justifyContent="center">
        <VStack align="start" textColor="#5B8FB9">
          {quizzes &&
            Object.values(quizzes).map((quiz, index) => (
              <Box key={quiz.id} p={2} borderBottom="1px" borderColor="#5B8FB9">
                {`${index + 1}. ${quiz.title}`}
              </Box>
            ))}
        </VStack>
      </Flex>
      <Text color="#5B8FB9" mb={4} fontSize="large" mt={4} textAlign="center">
        Sign in to try them
      </Text>
    </Box>
  );
}
