import { Container, Flex } from "@chakra-ui/layout";
import Content from "../../components/UserProfile/Content/Content";

export default function UserProfile() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      background={`url(src/assets/on_air.png) center center / cover no-repeat`}
    >
      <Flex
        direction="column"
        alignItems="center"
        maxW="80%"
        width={{ base: "90%", sm: "70%", md: "40%" }} 
        height={{ base: "50%", sm: "30%", md: "80%" }}
        paddingX={{ base: 4, sm: 6, md: 8 }}
        paddingY={{ base: 4, sm: 8, md: 9 }}
      >
        <Content />
      </Flex>
    </Flex>
  );
}
