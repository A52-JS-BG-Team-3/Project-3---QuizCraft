import { Container, Flex } from "@chakra-ui/layout";
import Content from "../../components/UserProfile/Content/Content";

export default function UserProfile() {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      background={`url(src/assets/on_air.png) center center / cover no-repeat`}
    >
      <Container
       maxH="80%"
       maxW="80%"
       width="70vh"
       paddingX={{ base: 4, sm: 6, md: 8 }}
       paddingY={{ base: 4, sm: 8, md: 9 }}
      >
        <Content />
      </Container>
    </Flex>
  );
}
