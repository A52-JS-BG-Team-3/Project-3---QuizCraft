import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Textarea,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { db } from "../../config/firebase-config";

const StudentResults = () => {
  const toast = useToast();
  const { userName } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [fetchAttempts, setFetchAttempts] = useState(true);

  useEffect(() => {
    if (fetchAttempts) {
      const fetchQuizResults = async () => {
        try {
          const userAttemptsRef = ref(db, `attempted/${userName}`);
          const userAttemptsSnapshot = await get(userAttemptsRef);

          if (userAttemptsSnapshot.exists()) {
            const attemptsData = userAttemptsSnapshot.val();
            const quizIds = Object.keys(attemptsData);

            const attemptsList = quizIds
              .filter(
                (quizId) =>
                  !attemptsData[quizId]?.feedback &&
                  localStorage.getItem(`feedback_${userName}_${quizId}`) !==
                    "submitted"
              )
              .map((quizId) => {
                return {
                  quizId,
                  title: attemptsData[quizId]?.title || "Title not available",
                  score: attemptsData[quizId]?.score || "Score not available",
                };
              });

            setAttempts(attemptsList);
          } else {
            setAttempts([]);
          }
        } catch (error) {
          console.error("Error fetching quiz results:", error);
        }
      };

      fetchQuizResults();
      setFetchAttempts(false);
    }
  }, [userName, fetchAttempts]);

  const handleProvideFeedback = async (quizId) => {
    const feedbackRef = ref(db, `feedback/${userName}/${quizId}`);

    try {
      await set(feedbackRef, {
        title:
          attempts.find((attempt) => attempt.quizId === quizId)?.title ||
          "Title not available",
        score:
          attempts.find((attempt) => attempt.quizId === quizId)?.score ||
          "Score not available",
        feedback: feedback[quizId] || "",
      });

      setAttempts((prevAttempts) =>
        prevAttempts.filter((attempt) => attempt.quizId !== quizId)
      );

      setFeedback((prevFeedback) => {
        const { [quizId]: currentAttemptFeedback, ...restFeedback } =
          prevFeedback;
        return restFeedback;
      });

      localStorage.setItem(`feedback_${userName}_${quizId}`, "submitted");

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
      <Heading>Provide feedback to {userName} </Heading>
      {attempts.length > 0 ? (
        attempts.map((attempt) => (
          <Box key={attempt.quizId}>
            <Text fontSize="xl" fontWeight="bold" mb={2}></Text>
            <Text>Quiz Title: {attempt.title}</Text>
            <Text>Student Score: {attempt.score}</Text>

            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Provide Feedback:
            </Text>
            <Textarea
              value={feedback[attempt.quizId] || ""}
              onChange={(e) =>
                setFeedback((prevFeedback) => ({
                  ...prevFeedback,
                  [attempt.quizId]: e.target.value,
                }))
              }
              placeholder="Enter your feedback here..."
              size="md"
            />
            <Button
              onClick={() => handleProvideFeedback(attempt.quizId)}
              colorScheme="blue"
            >
              Submit Feedback
            </Button>
          </Box>
        ))
      ) : (
        <Text>No attempts for feedback available.</Text>
      )}
    </VStack>
  );
};

export default StudentResults;
