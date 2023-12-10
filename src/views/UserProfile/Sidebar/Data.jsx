import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchUserName } from "../../../services/user.service";
import { auth, db } from "../../../config/firebase-config";
import { onValue, ref, get } from "firebase/database";
const Data = () => {
  const [userData, setUserData] = useState({
    userFullName: "",
    userEmail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userName = await fetchUserName(auth.currentUser.uid);

        const userRef = ref(db, `users/${userName}`);
        const userSnapshot = await get(userRef);
        const initialUserData = userSnapshot.val() || {};

        setUserData((prevUserData) => ({
          ...prevUserData,
          userFullName: `${initialUserData.firstName || ""}`,
          userEmail: initialUserData.email,
        }));

        const unsubscribe = onValue(userRef, (snapshot) => {
          const updatedUserData = snapshot.val() || {};
          setUserData((prevUserData) => ({
            ...prevUserData,
            userFullName: `${updatedUserData.firstName || ""} ${
              updatedUserData.lastName || ""
            }`,
            userEmail: updatedUserData.email,
          }));
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <VStack as="ul" spacing={0} listStyleType="none" p={4}>
      <Box
        as="li"
        w="full"
        py={3}
        px={5}
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="#5B8FB9"
      >
        
      </Box>
      <Box
        as="li"
        w="full"
        py={3}
        px={5}
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="#5B8FB9"
      >
        <Text color="#5B8FB9">User Full Name</Text>
        <Text color="#5B8FB9" fontWeight="bold">
          {userData?.userFullName || ""}
        </Text>
      </Box>

      {/* Display email */}
      <Box
        as="li"
        w="full"
        py={3}
        px={5}
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="#5B8FB9"
      >
        <Text color="#5B8FB9">User Email</Text>
        <Text color="#5B8FB9" fontWeight="bold">
          {userData?.userEmail || ""}
        </Text>
      </Box>
    </VStack>
  );
};

export default Data;
