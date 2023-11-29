import { Box, Text, HStack } from "@chakra-ui/react";
import QuizzesOverview from "../QuizzesOverview/QuizzesOverview";

const neonBoxShadow = `
0 0 10px rgba(128, 0, 333, 0.8),
0 0 20px rgba(128, 0, 333, 0.8),
0 0 30px rgba(128, 0, 333, 0.8),
0 0 40px rgba(128, 0, 333, 0.8),
0 0 70px rgba(128, 0, 333, 0.8)
`;


const StudentsProfile = () => {
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

    </HStack>
  );
};
export default StudentsProfile;
