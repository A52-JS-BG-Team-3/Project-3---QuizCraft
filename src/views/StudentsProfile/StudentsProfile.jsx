import { Box, Text, HStack, useToast, Button, Heading, Image } from "@chakra-ui/react";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizHistory from "./QuizHistory";
import { neonBoxShadowTurquoise } from "../../components/BoxShadowsConts/boxshadows";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";

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
      const feedbackRef = ref(db, `feedback`);
      const feedbackSnapshot = await get(feedbackRef);

      if (feedbackSnapshot.exists()) {
        const feedbackData = feedbackSnapshot.val();
        const feedbackList = Object.keys(feedbackData).map((key) => ({
          key,
          ...feedbackData[key],
        }));

        setFeedback(feedback);
        console.log(feedbackList)
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const acceptInvitation = async (invitation) => {
    try {
      const invitationRef = ref(db, `invitations/${invitation.key}`);
      await update(invitationRef, { status: "accepted" });
  
      const quizzesRef = ref(db, "quizzes");
      const quizSnapshot = await get(quizzesRef);
  
      if (quizSnapshot.exists()) {
        const quizUid = Object.keys(quizSnapshot.val())[0];
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
        console.error("Quiz not found for quizId:", invitation.quizId);
        
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
    <HStack spacing={{ base: 4, md: 8 }} border="solid" bg="#03001C" pt="5%" pb="5%" pl="5%" pr="5%" boxShadow={neonBoxShadowPurple}>
      <Image src="src\assets\did_you_know.png" h="200px" />
      <Box p={4} boxShadow={neonBoxShadowTurquoise}>
       <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Quiz History 
        </Heading>
        <QuizHistory />
      </Box>
      <Box p={4} boxShadow={neonBoxShadowTurquoise}>
      <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
         Invitations
        </Heading>
        {invitations.map((invitation) => (
          <Box key={invitation.key} p={2} mb={2} border="1px" borderRadius="md">
            <Text color="white">
              Quiz: {invitation.quizId}
            </Text>
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
      <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
         Feedback
        </Heading>
        {feedback.map((feedbackItem) => (
          <Box key={feedbackItem.key} p={2} mb={2} border="1px" borderRadius="md">
            <Text color="white">
              Quiz Title: {feedbackItem.title}
            </Text>
            <Text color="white">
              Student Score: {feedbackItem.score !== null ? feedbackItem.score : "Score not available"}
            </Text>
            <Text color="white">
              Feedback: {feedbackItem.feedback}
            </Text>
          </Box>
        ))}
      </Box>
      <Image src="src\assets\quiz_time.png" h="290px" />
    </HStack>
  );
};
export default StudentsProfile;
