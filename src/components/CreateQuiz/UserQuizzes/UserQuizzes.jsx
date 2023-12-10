import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { auth } from '../../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Button, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import NeonButton from '../../NeonButton/NeonButton';
import { neonBoxShadowPurple } from '../../BoxShadowsConts/boxshadows';

const UserQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const headingColor = useColorModeValue("#FFFFC7");
  const bgColor = useColorModeValue('#03001C');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const quizzesRef = ref(db, 'quizzes');
        const snapshot = await get(quizzesRef);
        if (snapshot.exists()) {
          const quizzesData = snapshot.val();

          const userQuizzes = Object.keys(quizzesData)
            .filter(key => quizzesData[key].creatorUid === currentUser.uid)
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

  if (loading) {
    return <p>Loading quizzes...</p>;
  }


  return (
    <VStack spacing={8} align="stretch">
      <Box bg={bgColor} p={10} borderRadius="lg" boxShadow={neonBoxShadowPurple} maxW="800px" mx="auto" w="full" >
        <Heading color={headingColor} mb={4}>Your Quizzes</Heading>
        <Accordion allowMultiple textColor="#5B8FB9">
          {quizzes.map((quiz) => (
            <AccordionItem key={quiz.id} bg={bgColor} my={2}>
              <AccordionButton _expanded={{ bg: bgColor, color: headingColor }}>
                <Box flex="1" textAlign="left">{quiz.title}</Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text textColor="#5B8FB9">{quiz.description}</Text>
                <Text textColor="#5B8FB9">Created by: {quiz.createdBy}</Text>
                <Text textColor="#5B8FB9">Updated at: {quiz.updatedAt}</Text>
                <Text textColor="#5B8FB9">Questions: {quiz.questions.length}</Text>
                {/* <Text textColor="#5B8FB9">Times played: {quiz.timesPlayed}</Text>
                <Text textColor="#5B8FB9">Times completed: {quiz.timesCompleted}</Text>
                <Text textColor="#5B8FB9">Times failed: {quiz.timesFailed}</Text>
                <Text textColor="#5B8FB9">Times passed: {quiz.timesPassed}</Text>
                <Text textColor="#5B8FB9">Average score: {quiz.averageScore}</Text>
                <Text textColor="#5B8FB9">Best score: {quiz.bestScore}</Text> */}
                {/* <Button colorScheme="blue" onClick={() => handleEditQuiz(quiz.id)}>Edit Quiz</Button> */}
                <NeonButton text="Edit Quiz" onClick={() => handleEditQuiz(quiz.id)} />
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
