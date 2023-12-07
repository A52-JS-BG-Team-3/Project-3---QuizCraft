import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import {
  VStack,
  Image,
  Box,
  Text,
  Flex,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import NeonButton from "../../components/NeonButton/NeonButton";
import { neonBoxShadowTurquoise } from "../../components/BoxShadowsConts/boxshadows";



const QuizzesOverview = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      (quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quiz.category && quiz.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  const getFormattedDate = (timestamp) => {
    if (!timestamp) {
      return "Not specified";
    }

    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const quizzesRef = ref(db, "quizzes");
        const snapshot = await get(quizzesRef);
        if (snapshot.exists()) {
          const quizzesData = snapshot.val();
          const currentTime = new Date().getTime();

          const formattedQuizzes = Object.keys(quizzesData).map((key) => {
            const quiz = quizzesData[key];
            const hasEnded = quiz.endTime && currentTime > quiz.endTime;
            return {
              id: key,
              ...quiz,
              status: hasEnded ? "finished" : quiz.status,
            };
          });
          setQuizzes(formattedQuizzes);
        } else {
          console.log("No quizzes found.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  const bgColor = useColorModeValue("#03001C");

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width="150vh"
      height="90vh"
      background={`url(src/assets/on_air1.png) center center / cover no-repeat`}
      ss={{
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(45deg, #301E67, #5B8FB9)",
          borderRadius: "10px",
        },
      }}
    >
      <VStack spacing={8} align="stretch">
        <Flex
          bg={bgColor}
          p={10}
          boxShadow={neonBoxShadowTurquoise}
          w="110vh"
          h="50vh"
          mt="15%"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "linear-gradient(45deg, #301E67, #5B8FB9)",
              borderRadius: "10px",
            },
          }}
        >
          <VStack>
          <Input
            bg="#B6EAD"
            placeholder="Search by category or title..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredQuizzes.map((quiz) => (
              <Box
              key={quiz.id}
              bg={bgColor}
              p={4}
              border="solid"
              borderColor="#301E67"
              boxShadow={`0 0 10px #301E67, 0 0 20px #301E67, 0 0 30px #301E67, 0 0 40px #301E67, 0 0 70px #301E67`}
              borderRadius="md"
              >
                <Image src="src\assets\quiz_game.png"></Image>

                <Text textColor="#5B8FB9" fontWeight="bold" mb={2}>
                  {quiz.title}
                </Text>
                <Text>{quiz.description}</Text>
                <Text textColor="#5B8FB9">Created by: {quiz.createdBy}</Text>
                <Text textColor="#5B8FB9">Category: {quiz.category}</Text>
                <Text textColor="#5B8FB9">Time limit: {quiz.timeLimit}</Text>
                <Text textColor="#5B8FB9">
                  Status: {quiz.status || "Not specified"}
                </Text>
                <Text textColor="#5B8FB9">
                  Active from: {getFormattedDate(quiz.startTime)}
                </Text>
                <Text textColor="#5B8FB9">
                  Active until: {getFormattedDate(quiz.endTime)}
                </Text>

                {quiz.status !== "finished" ? (
                  <NeonButton text="Join" href={`/quiz/${quiz.id}`} />
                  ) : (
                    <Text textColor="#5B8FB9">This quiz has finished.</Text>
                    )}
              </Box>
            ))}
          </SimpleGrid>
          </VStack>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default QuizzesOverview;
