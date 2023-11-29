import { Box, Text, HStack, useToast, Button } from "@chakra-ui/react";
import QuizzesOverview from "../QuizzesOverview/QuizzesOverview";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const neonBoxShadow = `
0 0 10px rgba(128, 0, 333, 0.8),
0 0 20px rgba(128, 0, 333, 0.8),
0 0 30px rgba(128, 0, 333, 0.8),
0 0 40px rgba(128, 0, 333, 0.8),
0 0 70px rgba(128, 0, 333, 0.8)
`;

const StudentsProfile = () => {
  const [invitations, setInvitations] = useState([]);
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
    } catch (error) {
      console.error("Error accepting invitation:", error);
      
    }
  };
  

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <HStack spacing={4} border="solid" bg="#03001C" pt="5%" pb="5%" pl="5%" pr="5%" boxShadow={neonBoxShadow}>
      <Box p={4}>
        <QuizzesOverview />
      </Box>

      <Box p={4} boxShadow={neonBoxShadow}>
        <Text color="green">Participating Quizzes</Text>
      </Box>

      <Box p={4} boxShadow={neonBoxShadow}>
        <Text color="green">Contest Quizzes</Text>
      </Box>
      <Box p={4} boxShadow={neonBoxShadow}>
        <Text color="green">Score Board</Text>
      </Box>
      <Box p={4} boxShadow={neonBoxShadow}>
        <Text color="green">Invitations</Text>
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
    </HStack>
  );
};
export default StudentsProfile;
