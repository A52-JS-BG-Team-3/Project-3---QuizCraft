
import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Image,
  Center
} from '@chakra-ui/react';

const TeacherProfile = () => {
  return (
    <Box p={5}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Heading as="h1">Welcome, [Teacher Name]</Heading>
        </Box>
        <Box>
          <Input placeholder="Search Quizzes..." />
        </Box>
        <Box>
          <SimpleGrid columns={3} spacing={10}>
            {/* Replace these with actual quiz topic data */}
            <Box>
              <Center>
                <Image src="[Quiz Topic Icon URL]" boxSize="50px" />
              </Center>
              <Text textAlign="center">Math</Text>
            </Box>
            {/* Repeat for other topics */}
          </SimpleGrid>
        </Box>
        <Box>
          <Button colorScheme="blue">Live Quiz</Button>
          <Button colorScheme="green">Create Quiz</Button>
          <Button colorScheme="teal">Send Invitation</Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default TeacherProfile;
