import { useState, useEffect } from "react";
import {
  Box,
  // Button,
  Text,
  VStack,
  Textarea,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { db } from "../../config/firebase-config";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";
import NeonButton from "../../components/NeonButton/NeonButton";


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
    <VStack
      color="white"
      align="stretch"
      spacing={4}
      p={{ base: 2, md: 4, lg: 6 }}
      bg="#03001C"
      boxShadow={neonBoxShadowPurple}
    >
      <Heading color="#FFFFC7" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
        Provide feedback to {userName}
      </Heading>
      {attempts.length > 0 ? (
        attempts.map((attempt) => (
          <Box key={attempt.quizId} width="100%">
            <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" mb={2}>
              Quiz Title: {attempt.title}
            </Text>
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }}>Student Score: {attempt.score.toFixed(2)}</Text>
            <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" mb={2}>
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
              _placeholder={{ color: "black" }}
              textColor="black"
              size="md"
              bg="#5B8FB9"
            />
            <NeonButton
              onClick={() => handleProvideFeedback(attempt.quizId)}
              text="Submit Feedback"
            />
          </Box>
        ))
      ) : (
        <Text fontSize={{ base: "md", md: "lg", lg: "xl" }}>
          No attempts for feedback available.
        </Text>
      )}
    </VStack>
  );
};

export default StudentResults;
