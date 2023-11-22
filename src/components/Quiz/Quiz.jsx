import { useState, useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const Quiz = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [token, setToken] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.trivia_categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch a new session token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_token.php?command=request');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.response_code === 0) {
          setToken(data.token);
        }
      } catch (error) {
        console.error("Failed to fetch session token:", error);
      }
    };

    fetchToken();
  }, []);

  const startQuiz = async (categoryId) => {
    setSelectedCategory(categoryId);
    // Here you would implement fetching questions for the selected category using the session token
    // Make sure to handle the different response codes as per the API documentation
  };

  return (
    <Box>
      {categories.map((category) => (
        <Button key={category.id} onClick={() => startQuiz(category.id)} m={2}>
          {category.name}
        </Button>
      ))}
      {/* Render quiz questions and handle quiz logic here */}
      {/* Use the selectedCategory and token state variables to fetch and handle questions */}
    </Box>
  );
};

export default Quiz;
