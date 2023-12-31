import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const QuizForm = ({ onAddQuestion }) => {
  const [questionText, setQuestionText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  const handleAddQuestion = () => {
    if (
      !questionText.trim() ||
      !selectedOption ||
      !options.A.trim() ||
      !options.B.trim() ||
      !options.C.trim() ||
      !options.D.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newQuestion = {
      questionText,
      correctAnswer: options[selectedOption],
      optionA: options.A,
      optionB: options.B,
      optionC: options.C,
      optionD: options.D,
    };

    onAddQuestion(newQuestion);
    setQuestionText("");
    setSelectedOption("");
    setOptions({ A: "", B: "", C: "", D: "" });
  };

  const nextButtonStyle = {
    backgroundColor: "#FFFF66",
    color: "black",
    fontWeight: "bold",
    boxShadow: "0 0 5px #FFFF66, 0 0 10px #FFFF66",
    _hover: {
      opacity: 1,
      boxShadow: "0 0 10px #FFFF66, 0 0 20px #FFFF66, 0 0 30px #FFFF66",
    },
    _active: {
      transform: "scale(0.98)",
    },
    _focus: {
      outline: "none",
    },
    mt: 4,
  };

  return (
    <Box
      w="100%"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="purple.900"
    >
      <VStack spacing={3}>
        <FormControl isRequired>
          <FormLabel color={"white"}>Question</FormLabel>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter question"
            textColor={questionText.length > 0 ? "white" : "red.500"}
          />
        </FormControl>
        {["A", "B", "C", "D"].map((option) => (
          <FormControl key={option} isRequired>
            <FormLabel color={"white"}>Option {option}</FormLabel>
            <Textarea
              value={options[option]}
              onChange={(e) => handleOptionChange(option, e.target.value)}
              placeholder={`Enter option ${option}`}
              textColor={questionText.length > 0 ? "white" : "red.500"}
            />
          </FormControl>
        ))}
        <FormControl as="fieldset" isRequired>
          <FormLabel as="legend" color={"white"}>
            Correct Answer
          </FormLabel>
          <RadioGroup onChange={setSelectedOption} value={selectedOption}>
            <HStack spacing="24px">
              {["A", "B", "C", "D"].map((option) => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </FormControl>
        <Button
          {...nextButtonStyle}
          onClick={handleAddQuestion}
          colorScheme="blue"
        >
          Add Question
        </Button>
      </VStack>
    </Box>
  );
};

QuizForm.propTypes = {
  onAddQuestion: PropTypes.func.isRequired,
};

export default QuizForm;
