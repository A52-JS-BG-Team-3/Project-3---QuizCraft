import { Box, Flex, Heading, Input, Button, VStack, Image } from '@chakra-ui/react';
import quizTimeImage from '../../assets/quiz_time.png';
import './TeacherProfile.css';

const TeacherProfile = () => {
  return (
    <Box pt={{ base: '100px', md: '120px' }} px={{ base: '5', md: '10' }}>
      <Flex direction="column" align="center" maxWidth="1200px" margin="0 auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center" className="glowing-heading" style={{ fontFamily: "'Lobster', cursive" }}>
          Welcome, Teacher Name
        </Heading>
        <Flex align="center" justify="center" width="full">
          <Box mr={10}> {/* You can adjust the margin as needed */}
          <Image src={quizTimeImage} className="floating-image" />

          </Box>
          <VStack spacing={4} align="stretch" width="full" maxW="lg"> {/* Adjust the width as needed */}
            <Input placeholder="Search Quizzes..." size="lg" />
            <Button colorScheme="blue" isFullWidth>Live Quiz</Button>
            <Button colorScheme="green" isFullWidth>Create Quiz</Button>
            <Button colorScheme="teal" isFullWidth>Send Invitation</Button>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TeacherProfile;
