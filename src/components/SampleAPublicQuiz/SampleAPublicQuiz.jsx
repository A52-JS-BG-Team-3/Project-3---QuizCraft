import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { db } from "../../config/firebase-config";
import { get, ref } from "firebase/database";

const neonBoxShadow = `
0 0 10px rgba(0, 255, 255, 0.8),
0 0 20px rgba(0, 255, 255, 0.8),
0 0 30px rgba(0, 255, 255, 0.8),
0 0 40px rgba(0, 255, 255, 0.8),
0 0 70px rgba(0, 255, 255, 0.8)
`;

const SampleAPublicQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = ref(db, "quizzes");
        const snapshot = await get(quizzesRef);
        const data = snapshot.val();

        if (data) {
          const formattedQuizzes = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setQuizzes(formattedQuizzes);
        } else {
          console.log("No quizzes found.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <Box
      bg="#03001C"
      p={4}
      mb={4}
      boxShadow={neonBoxShadow}
      textColor="#5B8FB9"
      maxW="80%"
      mx="auto"
    >
      <Heading color="#5B8FB9" mb={4} fontSize="xl">
        Sample some of our public quizzes
      </Heading>
      <Flex justify="space-between" align="center">
        {quizzes.slice(0, 5).map((quiz) => (
          <Box
            key={quiz.id}
            p={4}
            bg="#1A1A1D"
            borderRadius="md"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              {quiz.title}
            </Text>
            <Text fontSize="xs" color="gray.300">
              {quiz.category}
            </Text>
            <Text fontSize="xs" color="gray.300">
              {quiz.createdBy}
            </Text>
            <Text fontSize="xs" color="gray.300">
              {quiz.timeLimit} minutes
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default SampleAPublicQuiz;
