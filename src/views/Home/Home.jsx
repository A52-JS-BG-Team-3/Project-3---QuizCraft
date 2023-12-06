import "./Home.css";
import { VStack, Flex, Box, Grid } from "@chakra-ui/react";
import quizImage from "../../assets/quiz.png";
import LengthiestQuizzes from "../../components/LengthiestQuizzes/LengthiestQuizzes";
import DidYouKnow from "../../components/DidYouKnow/DidYouKnow";
import SampleAPublicQuiz from "../../components/SampleAPublicQuiz/SampleAPublicQuiz";
import GlobalScoreboard from "./GlobalScoreborad";

export default function Home() {
  return (
    <VStack spacing={4} className="image-container">
      <Flex alignItems="center">
        <LengthiestQuizzes />
        <img src={quizImage} alt="quiz" className="centered-image" />
        <SampleAPublicQuiz />
      </Flex>
      <Flex alignItems="center">
        <DidYouKnow />
      </Flex>
      <Flex >
  <GlobalScoreboard />
</Flex>
    </VStack>
  );
}
