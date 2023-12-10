import "./Home.css";
import { VStack, Flex, Image } from "@chakra-ui/react";
import quizImage from "../../assets/quiz.png";
import LengthiestQuizzes from "../../components/LengthiestQuizzes/LengthiestQuizzes";
import DidYouKnow from "../../components/DidYouKnow/DidYouKnow";
import SampleAPublicQuiz from "../../components/SampleAPublicQuiz/SampleAPublicQuiz";
import GlobalScoreboard from "./GlobalScoreboard";

export default function Home() {
  return (
    <VStack spacing={4} align="center" className="image-container">

      <Flex alignItems="center" justify="space-around" width="100%">
        <LengthiestQuizzes />
        <Image src={quizImage} alt="quiz" className="centered-image" />
        <SampleAPublicQuiz />
      </Flex>

      <Flex alignItems="center" justify="center" width="100%">
        <DidYouKnow />
      </Flex>

      <Flex width="100%">
        <GlobalScoreboard />
      </Flex>
      
    </VStack>
  );
}
