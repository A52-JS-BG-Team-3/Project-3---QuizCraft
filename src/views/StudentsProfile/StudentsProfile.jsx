import { Box, Text, HStack, useToast, Button } from "@chakra-ui/react";
import { ref, get, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizHistory from "./QuizHistory";
import { neonBoxShadowTurquoise } from "../../components/BoxShadowsConts/boxshadows";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";
import { fetchUserName } from "../../services/user.service";
import { auth } from "../../config/firebase-config";

const StudentsProfile = () => {
  const [invitations, setInvitations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    try {
      const invitationsRef = ref(db, `invitations`);
      const invitationsSnapshot = await get(invitationsRef);

      if (invitationsSnapshot.exists()) {
        const invitationsData = invitationsSnapshot.val();
        const invitationList = Object.keys(invitationsData).map((key) => ({
          key,
          ...invitationsData[key],
        }));

        setInvitations(invitationList);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const currentUsername = await fetchUserName(auth.currentUser.uid);
      const feedbackRef = ref(db, `feedback/${currentUsername}`);
      const feedbackSnapshot = await get(feedbackRef);

      if (feedbackSnapshot.exists()) {
        const feedbackData = feedbackSnapshot.val();
        const feedbackList = Object.keys(feedbackData).map((key) => ({
          key,
          ...feedbackData[key],
        }));

        setFeedback(feedbackList);
      } else {
        setFeedback([]);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const acceptInvitation = async (invitation) => {
    try {
      const quizzesRef = ref(db, "quizzes");
      const quizSnapshot = await get(quizzesRef);
  
      if (quizSnapshot.exists()) {
        const quizzesData = quizSnapshot.val();
        const matchingQuiz = Object.entries(quizzesData).find(
          ([, quiz]) => quiz.title === invitation.quizId
        );
  
        if (matchingQuiz) {
          const [quizUid] = matchingQuiz;
          navigate(`/quiz/${quizUid}`);
  
          const deletedInvitationRef = ref(db, `invitations/${invitation.key}`);
          await remove(deletedInvitationRef);
  
          toast({
            title: "Invitation Accepted",
            description: `You have accepted the invitation for Quiz ${invitation.quizId}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.error("Quiz not found for quiz title:", invitation.quizId);
        }
      } else {
        console.error("No quizzes found");
      }
  
      fetchFeedback(); 
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchFeedback();
  }, []);

  return (
    <HStack
      spacing={4}
      border="solid"
      bg="#03001C"
      pt="5%"
      pb="5%"
      pl="5%"
      pr="5%"
      boxShadow={neonBoxShadowPurple}
    >
      <Box p={4} boxShadow={neonBoxShadowTurquoise}>
        <Text color="green">Quiz History</Text>
        <QuizHistory />
      </Box>
      <Box p={4} boxShadow={neonBoxShadowTurquoise}>
        <Text color="green">Invitations</Text>
        {invitations.map((invitation) => (
          <Box
            key={invitation.key}
            p={2}
            mb={2}
            border="1px"
            borderRadius="md"
          >
            <Text color="white">Quiz: {invitation.quizId}</Text>
            {invitation.status === "pending" && (
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => acceptInvitation(invitation)}
              >
                Accept
              </Button>
            )}
          </Box>
        ))}
      </Box>
      <Box p={4} boxShadow={neonBoxShadowTurquoise}>
        <Text color="green">Feedback</Text>
        {feedback.map((userFeedback) => (
          <Box
            key={userFeedback.key}
            p={2}
            mb={2}
            border="1px"
            borderRadius="md"
          >
            <Text color="white">Quiz Title: {userFeedback.title}</Text>
            <Text color="white">
              Student Score: {userFeedback.score !== null ? userFeedback.score.toFixed(2) : "Score not available"}
            </Text>
            <Text color="white">Feedback: {userFeedback.feedback}</Text>
          </Box>
        ))}
      </Box>
    </HStack>
  );
};

export default StudentsProfile;
