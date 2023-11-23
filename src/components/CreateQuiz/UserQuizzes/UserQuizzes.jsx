import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { auth } from '../../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Button, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';


const UserQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const headingColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const quizzesRef = ref(db, 'quizzes');
        const snapshot = await get(quizzesRef);
        if (snapshot.exists()) {
          const quizzesData = snapshot.val();
          // Филтрирайте куизовете на текущия потребител на клиента
          const userQuizzes = Object.keys(quizzesData)
            .filter(key => quizzesData[key].createdBy === currentUser.uid)
            .map(key => ({
              id: key,
              ...quizzesData[key],
            }));
          setQuizzes(userQuizzes);
        } else {
          console.log('No quizzes found.');
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
      setLoading(false);
    };
  
    if (currentUser) {
      fetchQuizzes();
    }
  }, [currentUser]);

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  if (loading) return <p>Loading quizzes...</p>;

  return (
        <VStack
          spacing={8} // This adds space between each child element
          align="stretch" // This makes children fill the width
          pt="100px" // Adjust this value as needed to avoid navbar overlap
        >
          <Box
            bg={bgColor}
            p={10}
            borderRadius="lg"
            boxShadow="xl"
            maxW="800px" // Maximum width of the component
            mx="auto" // Auto margins for horizontal centering
            w="full" // Full width within the max width
          >
            <Heading color={headingColor} mb={4}>
              Your Quizzes
            </Heading>
      <Accordion allowMultiple>
        {quizzes.map((quiz) => (
          <AccordionItem key={quiz.id} bg={bgColor} my={2}>
            <AccordionButton _expanded={{ bg: bgColor, color: headingColor }}>
              <Box flex="1" textAlign="left">
                {quiz.title}
              </Box>
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Text>{quiz.description}</Text>
                <Text>Created by: {quiz.createdBy}</Text>
                <Text>Updated at: {quiz.updatedAt}</Text>
                <Text>Questions: {quiz.questions.length}</Text>
                <Text>Times played: {quiz.timesPlayed}</Text>
                <Text>Times completed: {quiz.timesCompleted}</Text>
                <Text>Times failed: {quiz.timesFailed}</Text>
                <Text>Times passed: {quiz.timesPassed}</Text>
                <Text>Average score: {quiz.averageScore}</Text>
                <Text>Best score: {quiz.bestScore}</Text>
                <Button colorScheme="blue" onClick={() => handleEditQuiz(quiz.id)}>Edit Quiz</Button>
              {/* Add delete button or other functionalities as required */}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {quizzes.length === 0 && <Text>No quizzes to display.</Text>}
    </Box>
    </VStack>
  );
};

export default UserQuizzes;