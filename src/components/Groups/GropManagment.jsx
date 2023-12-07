import GroupForm from "./GroupForm";
import GroupList from "./GroupList";
import { Flex,HStack,VStack } from "@chakra-ui/react";
import { neonBoxShadowPurple } from "../BoxShadowsConts/boxshadows";

const GroupManagement = () => {
  return (
    <Flex>
    <HStack boxShadow={neonBoxShadowPurple}  p={4} bg="#03001C">
      <VStack>
      <GroupForm actionType="join" />
      <GroupForm actionType="create" />
      </VStack>
      <GroupList />
    </HStack>
  </Flex>
  );
};

export default GroupManagement;
