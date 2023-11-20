import {
  Flex,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/context";
import { useContext, useState, useEffect } from "react";
import { logoutUser } from "../../services/auth.service";
import { db } from "../../config/firebase-config";
import { fetchUserName } from "../../services/user.service";
import { ref, get } from "@firebase/database";

export const UserPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (user !== null) {
        try {
          const fetchedUserName = await fetchUserName(user.uid);
          // console.log('fetchedUserName:', fetchedUserName);

          const usersRef = ref(db, `users/${fetchedUserName}`);
          const snapshot = await get(usersRef);
          // console.log('snapshot.val():', snapshot.val());

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserProfile(userData?.profileImage || null);
            setUserName(fetchedUserName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getCurrentUser();
  }, [user]);

  const goToUserProfile = () => {
    if (user !== null) {
      navigate("/userprofile");
    } else {
      navigate("/signin");
      alert("Please Sign In!");
    }
  };

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <Divider
          orientation="vertical"
          mx={4}
          height="40px"
          borderColor="#332C30"
        />
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
          paddingRight={"1"}
        >
          <Flex pr={""}>
            <Avatar size={"sm"} src={userProfile || null} pr={""} />
          </Flex>
        </MenuButton>
        <Box
          border={"solid"}
          bg={"#FFD580"}
          pr={"2"}
          pl={""}
          borderRadius={"50px"}
        >
          <Text ml={2} fontWeight="bold">
            {userName}
          </Text>
        </Box>
        <Divider
          orientation="vertical"
          mx={4}
          height="40px"
          borderColor="#332C30"
        />
        <MenuList bg={"#FFD580"} border={"none"}>
          <MenuItem onClick={goToUserProfile} bg={"#FFD580"}>
            Profile Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={logoutUser} bg={"#FFD580"}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
