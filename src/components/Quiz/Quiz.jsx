// QuizPicker.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Select,
  Button,
  Spinner,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";

const QuizPicker = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    // Fetch categories on component mount
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.trivia_categories);
        setLoadingCategories(false);
      });
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFetchQuiz = () => {
    setLoadingQuiz(true);
    
    // Fetch quiz based on the selected category
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        const quiz = data.results.map((question) => {
          if (question.type === "multiple") {
            return {
              ...question,
              choices: [...question.incorrect_answers, question.correct_answer],
            };
          } else {
            return {
              ...question,
              choices: [question.correct_answer],
            };
          }
        });

        // Set the selected quiz
        setSelectedQuiz(quiz);
        setLoadingQuiz(false);
      });
  };

  return (
    <Flex
      p={4}
      width="100%"
      alignItems="center"
      justifyContent="center"
      pt={{ base: "5%", md: "10%" }}
    >
      <FormControl alignItems={"left"} justifyContent={"left"}>
        <FormLabel>Select a Category:</FormLabel>
        <Select
          id="category"
          onChange={handleCategoryChange}
          value={selectedCategory}
          mb={2}
        >
          <option value="">Any Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleFetchQuiz} colorScheme="teal" ml={2}>
        Fetch Random Quiz
      </Button>
      {loadingCategories && <Spinner size="md" color="teal" ml={2} />}
      <Box textAlign="center" p={8} bg={"white"}>
        {loadingQuiz ? (
          <Spinner size="xl" color="teal" />
        ) : (
          selectedQuiz && (
            <div>
            <Heading as="h2" mb={4}>
              Random Quiz
            </Heading>
            {/* Render the quiz questions here */}
            <UnorderedList>
              {selectedQuiz.map((question, index) => (
                <ListItem key={index} mb={4}>
                  {/* Render the HTML-encoded text */}
                  <div dangerouslySetInnerHTML={{ __html: question.question }} />
                  <UnorderedList ml={4}>
                    {question.choices.map((choice, choiceIndex) => (
                      <ListItem key={choiceIndex}>
                        {/* Render the HTML-encoded text for choices */}
                        <div dangerouslySetInnerHTML={{ __html: choice }} />
                      </ListItem>
                    ))}
                  </UnorderedList>
                </ListItem>
              ))}
            </UnorderedList>
          </div>
          )
        )}
      </Box>
    </Flex>
  );
};

export default QuizPicker;
