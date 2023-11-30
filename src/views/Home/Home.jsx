import "./Home.css";
import { HStack, VStack, Box } from "@chakra-ui/react";
import quizImage from "../../assets/quiz.png";
import LatestQuizz from "../../components/LatestQuizz/LatestQuizz";
import DidYouKnow from "../../components/DidYouKnow/DidYouKnow";
import SampleAPublicQuiz from "../../components/SampleAPublicQuiz/SampleAPublicQuiz";

export default function Home() {
  return (
    <VStack
      spacing={4}
      align="center"
      className="image-container"
      w="100%"
      h="100%"
      p={10}
    >
      <HStack
        spacing={4}
        align="center"
        justify={{ base: "center", md: "space-between" }}
        w="100%"
        flexWrap="wrap"
      >
        <LatestQuizz />
        <img src={quizImage} alt="quiz" className="centered-image" />
        <DidYouKnow />
      </HStack>
      <SampleAPublicQuiz />
    </VStack>
  );
}
