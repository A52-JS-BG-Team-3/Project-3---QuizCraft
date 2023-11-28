import "./Home.css";
import { Flex } from "@chakra-ui/react";
import quizImage from "../../assets/quiz.png";
import LatestQuizz from "../../components/LatestQuizz/LatestQuizz";
import DidYouKnow from "../../components/DidYouKnow/DidYouKnow";

export default function Home() {
  return (
    <Flex
      className="image-container"
      css={{
        overflowX: "auto",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #f06, #9f6)",
          borderRadius: "10px",
        },
      }}
    >
      <LatestQuizz />
      <img src={quizImage} alt="quiz" className="centered-image" />
      <DidYouKnow />
    </Flex>
  );
}
