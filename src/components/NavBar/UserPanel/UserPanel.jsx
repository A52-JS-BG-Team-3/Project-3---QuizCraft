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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../../context/context";
import { useContext, useState, useEffect } from "react";
import { logoutUser } from "../../../services/auth.service";
import { db } from "../../../config/firebase-config";
import { fetchUserName } from "../../../services/user.service";
import { ref, get } from "@firebase/database";

//custom box shadow for this component
const neonBoxShadow = `
  0 0 1px rgba(200, 0, 0, 0.8),
  0 0 5px rgba(200, 0, 0, 0.8),
  0 0 10px rgba(200, 0, 0, 0.8),
  0 0 20px rgba(200, 0, 0, 0.8),
  0 0 40px rgba(200, 0, 0, 0.8)
`;

export const UserPanel = () => {
  const navigate = useNavigate();
  const { user, userData } = useContext(AppContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (user !== null) {
        try {
          const fetchedUserName = await fetchUserName(user.uid);

          const usersRef = ref(db, `users/${fetchedUserName}`);
          const snapshot = await get(usersRef);

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

  const goToTeacherProfile = () => {
    if (user !== null) {
      navigate("/teacher");
    } else {
      navigate("/signin");
      alert("Please Sign In!");
    }
  };

  const goToStudentsProfile = () => {
    if (user !== null) {
      navigate("/student");
    } else {
      navigate("/signin");
      alert("Please Sign In!");
    }
  };

  const goToGroups = () => {
    if (user !== null) {
      navigate("/groups");
    } else {
      navigate("/signin");
      alert("Please Sign In!");
    }
  };

  const goToQuizes = () => {
    if (user !== null) {
      navigate("/quizzesoverview");
    } else {
      navigate("/signin");
      alert("Please Sign In!");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
          paddingRight={"5"}
        >
          <Flex pr={""}>
            <Avatar size={"sm"} src={userProfile || null} pr={""} />
          </Flex>
          <Flex>
          </Flex>
        </MenuButton>
        <Box
          border={"solid"}
          borderColor={"#C41E3A"}
          boxShadow={neonBoxShadow}
          borderRadius="5px"
          bg={"#B6EADA"}
          pr={"2"}
          pl={""}
          >
          <Text ml={2} fontWeight="bold">
            {userName}
          </Text>
        </Box>
        <MenuList bg={"#B6EADA"} border={"solid"} borderColor={"#5B8FB9"}>
          <MenuItem onClick={goToUserProfile} bg={"#B6EADA"}>
            Account Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={goToQuizes} bg={"#B6EADA"}>
            Quizzes
          </MenuItem>
          <MenuDivider />
          {userData && userData.role === "teacher" && (
            <>
              <MenuItem onClick={goToTeacherProfile} bg={"#B6EADA"}>
                Teachers’ Lounge
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={goToGroups} bg={"#B6EADA"}>
                Groups
              </MenuItem>
              <MenuDivider />
            </>
          )}
          {userData && userData.role === "student" && (
            <>
              <MenuItem onClick={goToStudentsProfile} bg={"#B6EADA"}>
                Students’ Lounge
              </MenuItem>
              <MenuDivider />
            </>
          )}
          <MenuItem onClick={handleLogout} bg={"#B6EADA"}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
