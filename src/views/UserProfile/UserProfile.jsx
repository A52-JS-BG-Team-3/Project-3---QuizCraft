import { Flex } from "@chakra-ui/layout";
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
        width={{ base: "90%", sm: "70%", md: "85%" }}
        height={{ base: "70%", sm: "50%", md: "80%" }}
        padding={{ base: 4, sm: 6, md: 8 }}
        overflow="auto"
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
        <Content />
      </Flex>
    </Flex>
  );
}
