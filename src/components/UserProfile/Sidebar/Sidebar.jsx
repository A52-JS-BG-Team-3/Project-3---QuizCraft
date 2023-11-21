import { Box } from "@chakra-ui/react";

import Data from "./Data";
import Profile from "./Profile";

function Sidebar() {
  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      rounded="md"
      borderWidth={1}
      border={"none"}
      style={{ transform: "translateY(-100px)" }}
      boxShadow={
        "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
      }
      bg="rgba(255, 255, 255, 0.3)"
      backdropFilter="blur(5px)"
    >
      <Profile />

      <Data />
    </Box>
  );
}

export default Sidebar;
