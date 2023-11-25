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


const TeacherProfile = () => {
  const navigate = useNavigate();
  return (
    <Box pt={{ base: "100px", md: "120px" }} px={{ base: "5", md: "10" }}>
      <Flex direction="column" align="center" maxWidth="1200px" margin="0 auto">
        <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Welcome, Teacher Name
        </Heading>
        <Flex align="center" justify="center" width="full">
          <Box mr={10}>
            {" "}
            <Image src={quizTimeImage} className="floating-image" />
          </Box>
          <VStack spacing={4} align="stretch" width="full" maxW="lg">
            {" "}
            <Input placeholder="Search Quizzes..." size="lg" />
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
