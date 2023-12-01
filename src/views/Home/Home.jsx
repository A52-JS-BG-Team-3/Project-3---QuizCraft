import "./Home.css";
import { VStack, Flex, Box } from "@chakra-ui/react";
import quizImage from "../../assets/quiz.png";
import LatestQuizz from "../../components/LatestQuizz/LatestQuizz";
import DidYouKnow from "../../components/DidYouKnow/DidYouKnow";
import SampleAPublicQuiz from "../../components/SampleAPublicQuiz/SampleAPublicQuiz";

export default function Home() {
  return (
    <VStack spacing={4} className="image-container">
      <Flex alignItems="center">
        <LatestQuizz />
        <img src={quizImage} alt="quiz" className="centered-image" />
        <SampleAPublicQuiz />
      </Flex>
      <Flex alignItems="center">
        <DidYouKnow />
      </Flex>
    </VStack>
  );
}
