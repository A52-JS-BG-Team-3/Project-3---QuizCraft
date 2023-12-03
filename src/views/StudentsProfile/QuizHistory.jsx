import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useParams } from "react-router-dom";
import { fetchUserName } from "../../services/user.service";
import { auth } from "../../config/firebase-config";

const QuizHistory = () => {
  const { uid } = useParams();
  const [quizAttempts, setQuizAttempts] = useState([]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const userName = await fetchUserName(auth.currentUser.uid);

        if (userName) {
          const userAttemptsRef = ref(db, `attempted/${userName}`);
          const userAttemptsSnapshot = await get(userAttemptsRef);

          if (userAttemptsSnapshot.exists()) {
            const attemptsData = userAttemptsSnapshot.val();

            const attemptsArray = Object.keys(attemptsData).map((quizId) => ({
              quizId,
              title: attemptsData[quizId]?.title,
              score: attemptsData[quizId]?.score.toFixed(2),
              attemptedAt: new Date(attemptsData[quizId]?.attemptedAt,).toLocaleString()
            }));

            setQuizAttempts(attemptsArray);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchQuizResults();
  }, [uid]);

  return (
    <VStack color="white" align="stretch" spacing={4} p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Quiz History
      </Text>
      {quizAttempts.map((attempt, index) => (
        <Box key={index}>
          <Text>Quiz Title: {attempt.title}</Text>
          <Text>Score: {attempt.score}</Text>
          <Text>Attempted At: {attempt.attemptedAt}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default QuizHistory;
