import { Box } from "@chakra-ui/react";

import Data from "./Data";
import Profile from "./Profile";

function Sidebar() {
  return (
    <Box>
      <Profile />
      <Data />
    </Box>
  );
}

export default Sidebar;
