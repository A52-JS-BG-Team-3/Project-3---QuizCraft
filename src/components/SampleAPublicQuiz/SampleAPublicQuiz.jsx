import { useState, useEffect } from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { db } from "../../config/firebase-config";
import { get, ref } from "firebase/database";
import { neonBoxShadowTurquoise } from "../BoxShadowsConts/boxshadows";
import NeonButton from "../NeonButton/NeonButton";

const SampleAPublicQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = ref(db, "quizzes");
        const snapshot = await get(quizzesRef);
        const data = snapshot.val();

        if (data) {
          const formattedQuizzes = Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .filter((quiz) => quiz.type === "open") 
            .slice(0, 3); 

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
      boxShadow={neonBoxShadowTurquoise}
      textColor="#5B8FB9"
      maxW="80%"
      mx="auto"
    >
      <Heading color="#FFFFC7" mb={4} fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
        Sample some of our public quizzes
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {quizzes.map((quiz) => (
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
            {quiz.status !== "closed" ? (
              <NeonButton text="Join" href={`/quiz/${quiz.id}`} />
            ) : (
              <Text textColor="#5B8FB9">This quiz has finished.</Text>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SampleAPublicQuiz;
