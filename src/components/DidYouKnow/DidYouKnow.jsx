import { ListItem, Box, Image, List, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { neonBoxShadowPurple } from "../BoxShadowsConts/boxshadows";

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
      boxShadow={neonBoxShadowPurple}
      textColor="#5B8FB9"
      maxW="100%"
      w="100%"
    >
      <Image src="src/assets/did_you.png" alt="logo" height="100px" mx="auto"/>
      
        
          <List spacing={2} textAlign="center">
            {facts.map((fact, index) => (
              <ListItem key={index} textAlign="center">
                <Text as="span" display="inline-block" marginRight="2">
                  •
                </Text>
                {fact.fact}
              </ListItem>
            ))}
          </List>
        
      
    </Box>
  );
};

export default DidYouKnow;
