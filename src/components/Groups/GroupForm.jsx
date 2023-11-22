// GroupForm.jsx
import { useState, useContext } from "react";
import { ref, push, get, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import AppContext from "../../context/context";
import { fetchUserName } from "../../services/user.service";
import PropTypes from "prop-types";
import { Box, Heading, Input, Button } from "@chakra-ui/react";

const GroupForm = ({ actionType }) => {
  const [groupName, setGroupName] = useState("");
  const { user } = useContext(AppContext);

  const handleGroupAction = async () => {
    if (groupName.trim() !== "") {
      const groupsRef = ref(db, "groups");
      const userUserName = await fetchUserName(user.uid);

      
      if (actionType === "create") {
        push(groupsRef, { name: groupName });
      }

      
      if (actionType === "join") {
        const groupRef = ref(db, `groups/${groupName}`);
        const groupSnapshot = await get(groupRef);

        if (groupSnapshot.exists()) {
          const userRef = ref(db, `users/${userUserName}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();

            await update(userRef, {
              groupId: groupName,
              groupName: groupSnapshot.val().name,
            });

            
            await update(groupRef, {
              members: {
                [user.uid]: {
                  userName: userUserName,
                  displayName: userData.displayName,
                },
              },
            });

            alert(`Successfully joined group ${groupName}`);
          } else {
            alert("Error fetching user data.");
          }
        } else {
          alert(`Group ${groupName} does not exist`);
        }
      }

      setGroupName("");
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
      <Button
        colorScheme="teal"
        mt={2}
        onClick={handleGroupAction}
      >
        {actionType === "create" ? "Create Group" : "Join Group"}
      </Button>
    </Box>
  );
};

GroupForm.propTypes = {
  actionType: PropTypes.oneOf(["create", "join"]).isRequired,
};

export default GroupForm;
