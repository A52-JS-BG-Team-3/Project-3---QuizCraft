import { Flex, VStack, ListItem, Box, Heading, List, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const neonBoxShadow = `
  0 0 10px rgba(128, 0, 333, 0.8),
  0 0 20px rgba(128, 0, 333, 0.8),
  0 0 30px rgba(128, 0, 333, 0.8),
  0 0 40px rgba(128, 0, 333, 0.8),
  0 0 70px rgba(128, 0, 333, 0.8)
`;

const apiKey = import.meta.env.VITE_API_KEY;

const DidYouKnow = () => {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    fetch("https://api.api-ninjas.com/v1/facts?limit=5", {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
      contentType: "application/json",
    })
      .then((response) => response.json())
      .then((data) => {
        setFacts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <Box
      bg="#03001C"
      p={4}
      mb={4}
      boxShadow={neonBoxShadow}
      textColor="#5B8FB9"
      maxW="100%"
      
    >
      <Heading color="#5B8FB9" mb={4} fontSize={{ base: "xl", md: "2xl" }}>
        Did you know?
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} align={{ base: "start", md: "center" }}>
        <VStack align="start" >
          <List spacing={2}>
            {facts.map((fact, index) => (
              <ListItem key={index}>
                <Text as="span" display="inline-block" marginRight="2">
                  •
                </Text>
                {fact.fact}
              </ListItem>
            ))}
          </List>
        </VStack>
      </Flex>
    </Box>
  );
};

export default DidYouKnow;
