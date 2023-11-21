import {
    Box,
    Button,
    Heading,
    Input,
    SimpleGrid,
    Text,
    VStack,
    Image,
    Center,
  } from '@chakra-ui/react';
  import quizImage from '../../assets/quiz.png';
  
  const TeacherProfile = () => {
    return (
      <Box
        p={200}
      >
        <VStack spacing={4} align="stretch">
          <Center>
            <Heading as="h1">Welcome, [Teacher Name]</Heading>
          </Center>
          <Center>
            <Input placeholder="Search Quizzes..." />
          </Center>
          <Center>
            <SimpleGrid columns={3} spacing={10}>
              {/* Replace these with actual quiz topic data */}
              <Box>
                <Center>
                  <Image src={quizImage} />
                </Center>
                <Text textAlign="center">Math</Text>
              </Box>
              {/* Repeat for other topics */}
            </SimpleGrid>
          </Center>
          <Center>
            <Button colorScheme="blue">Live Quiz</Button>
            <Button colorScheme="green">Create Quiz</Button>
            <Button colorScheme="teal">Send Invitation</Button>
          </Center>
        </VStack>
      </Box>
    );
  };
  
  export default TeacherProfile;
  