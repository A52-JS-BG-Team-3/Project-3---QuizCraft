import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Flex, SimpleGrid } from "@chakra-ui/react";
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
      <Heading color="#5B8FB9" mb={4} fontSize={{ base: "xl", md: "2xl" }}>
        Sample some of our public quizzes
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {quizzes.slice(0, 5).map((quiz) => (
          <Box
            key={quiz.id}
            p={4}
            bg="#1A1A1D"
            borderRadius="md"
            textAlign="center"
            border="solid"
            borderColor="#301E67"
          >
            <Text fontSize="sm" fontWeight="bold" color="#5B8FB9" >
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
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SampleAPublicQuiz;
