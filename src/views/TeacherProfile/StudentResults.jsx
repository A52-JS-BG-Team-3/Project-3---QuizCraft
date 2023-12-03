import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useParams} from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { db } from "../../config/firebase-config";

const StudentResults = () => {
  const toast = useToast();
  const { userName } = useParams();
  const [title, setTitle] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const userAttemptsRef = ref(db, `attempted/${userName}`);
        const userAttemptsSnapshot = await get(userAttemptsRef);

        if (userAttemptsSnapshot.exists()) {
          const attemptsData = userAttemptsSnapshot.val();

          const quizIds = Object.keys(attemptsData);

          if (quizIds.length > 0) {
            const latestQuizId = quizIds[quizIds.length - 1];

            setTitle(attemptsData[latestQuizId]?.title);
            setScore(attemptsData[latestQuizId]?.score);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchQuizResults();
  }, [userName]);

  const handleProvideFeedback = async () => {
    const feedbackRef = ref(db, `feedback/${userName}`);

    try {
      await set(feedbackRef, {
        title,
        score,
        feedback,
      });

      toast({
        title: "Feedback Submitted",
        description: "Feedback has been submitted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack color="white" align="stretch" spacing={4} p={4}>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Quiz Results
        </Text>
        <Text>
          Quiz Title: {title !== null ? title : "Title not available"}
        </Text>
        <Text>
          Student Score: {score !== null ? score : "Score not available"}
        </Text>
      </Box>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Provide Feedback:
        </Text>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          size="md"
        />
        <Button onClick={handleProvideFeedback} colorScheme="blue">
          Submit Feedback
        </Button>
      </Box>
    </VStack>
  );
};

export default StudentResults;
