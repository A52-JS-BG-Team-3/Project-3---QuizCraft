import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Image,
} from "@chakra-ui/react";
import quizTimeImage from "../../assets/quiz_time.png";
import "./TeacherProfile.css";
import { useNavigate } from 'react-router-dom';

const neonBoxShadow = `
  0 0 10px rgba(200, 50, 200, 0.8),
  0 0 20px rgba(200, 50, 200, 0.8),
  0 0 30px rgba(200, 50, 200, 0.8),
  0 0 40px rgba(200, 50, 200, 0.8),
  0 0 70px rgba(200, 50, 200, 0.8)
`;

const TeacherProfile = () => {
  const navigate = useNavigate();
  return (
    <Box pt={{ base: "100px", md: "120px" }} px={{ base: "5", md: "10" }} bg="#03001C" boxShadow={neonBoxShadow}>
      <Flex direction="column" align="center" maxWidth="1200px" margin="0 auto">
        <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Welcome, mr/ms teachers name
        </Heading>
        <Flex align="center" justify="center" width="full">
          <Box mr={10}>
            {" "}
            <Image src={quizTimeImage} className="floating-image" />
          </Box>
          <VStack spacing={4} align="stretch" width="full" maxW="lg">
            {" "}
            <Input placeholder="Search Students..." size="lg" />
            <Button colorScheme="blue" width="full">
              Search
            </Button>
            <Button colorScheme="green" width="full" onClick= {() => navigate('/createquiz')}>
              Create Quiz
            </Button>
            <Button colorScheme="purple" width="full" onClick= {() => navigate('/userquizzes')}>
              My Quizzes
            </Button>
            <Button colorScheme="teal" width="full">
              Send Invitation
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TeacherProfile;
