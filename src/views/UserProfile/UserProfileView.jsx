import { Flex } from "@chakra-ui/layout";
import Content from "/src/views/UserProfile/Content/Content.jsx"

export default function UserProfile() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      background={`url(src/assets/on_air.png) center center / cover no-repeat`}
    >
      <Flex
        direction="column"
        alignItems="center"
        width={{ base: "90%", sm: "70%", md: "100%" }}
        height={{ base: "70%", sm: "50%", md: "80%" }}
        paddingTop={"1%"}
        paddingLeft={"20%"}
        paddingBottom={"1%"}
        overflow="auto"
        css={{
          overflowX: "auto",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(45deg, #301E67, #5B8FB9)",
            borderRadius: "10px",
          },
        }}
      >
        <Content />
      </Flex>
    </Flex>
  );
}
