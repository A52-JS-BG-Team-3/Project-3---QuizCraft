import { useState, useContext } from "react";
import { ref, push, get, update, set } from "firebase/database";
import { db } from "../../config/firebase-config";
import AppContext from "../../context/context";
import PropTypes from "prop-types";
import { Box, Heading, Input, Button, useToast, Textarea } from "@chakra-ui/react";
import { fetchUserName } from "../../services/user.service";

const GroupForm = ({ actionType }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const { user } = useContext(AppContext);
  const toast = useToast(); 

  const handleGroupAction = async () => {
    if (groupName.trim() !== "") {
      const groupsRef = ref(db, "groups");
      const userUserName = await fetchUserName(user.uid);
  
      if (actionType === "create") {
        const groupRef = ref(db, `groups/${groupName}`);
        const creatorName = userUserName; 
        const members = {
          [user.uid]: {
            userName: creatorName,
          },
        };
        await set(groupRef, { name: groupName, description:groupDescription, members, createdBy: creatorName });
  
        toast({
          title: `Group ${groupName} created successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
  
      if (actionType === "join") {
        const groupRef = ref(db, `groups/${groupName}`);
        const groupSnapshot = await get(groupRef);
  
        if (groupSnapshot.exists()) {
          const existingMembers = groupSnapshot.val().members || {};
          const updatedMembers = {
            ...existingMembers,
            [user.uid]: {
              userName: userUserName,
            },
          };
  
          await update(groupRef, { members: updatedMembers });
  
          toast({
            title: `Successfully joined group ${groupName}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: `Group ${groupName} does not exist`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
  
      setGroupName("");
      setGroupDescription("");
    }
  };
  


  return (
    <Box>
      <Heading mb={4} color="white">
        {actionType === "create" ? "Create a Group" : "Join a Group"}
      </Heading>
      <Input
        type="text"
        backgroundColor={"white"}
        placeholder={`Enter ${
          actionType === "create" ? "group name" : "group ID"
        }`}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      {actionType === "create" && (
        <Textarea
          backgroundColor={"white"}
          placeholder="Enter group description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          mt={2}
        />
      )}
      <Button colorScheme="teal" mt={2} onClick={handleGroupAction}>
        {actionType === "create" ? "Create Group" : "Join Group"}
      </Button>
    </Box>
  );
};

GroupForm.propTypes = {
  actionType: PropTypes.oneOf(["create", "join"]).isRequired,
};

export default GroupForm;