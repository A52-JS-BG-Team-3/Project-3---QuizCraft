import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  VStack,
  Button,
  Box,
} from "@chakra-ui/react";
import { db, auth } from "../../../config/firebase-config";
import { ref, get, update } from "firebase/database";
import { fetchUserName } from "../../../services/user.service";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NeonButton from "../../NeonButton/NeonButton";

function AccountSettings() {
  const [userName, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userProvidedPassword, setUserProvidedPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const currentUserUid = auth.currentUser.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUserName = await fetchUserName(currentUserUid);
      setUsername(fetchedUserName);

      const useRef = ref(db, `users/${fetchedUserName}`);
      try {
        const snapshot = await get(useRef);
        if (snapshot.exists()) {
          const user = snapshot.val();
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
        } else {
          console.error("No user found in database.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUserUid]);

  const handleUpdate = async () => {
    const usersRef = ref(db, `users/${userName}`);
    const user = auth.currentUser;
    try {
      await update(usersRef, {
        firstName,
        lastName,
      });

      if (newPassword) {
        const passwordCredential = EmailAuthProvider.credential(
          user.email,
          userProvidedPassword
        );
        await reauthenticateWithCredential(user, passwordCredential);

        await updatePassword(user, newPassword);

        await auth.signOut();
        navigate("/");

        alert(
          "Password updated successfully. Please log in again with the new password."
        );
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <VStack spacing={3} p={4} align="start">
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        <Grid xs={12} md={6}>
          <FormControl id="firstName">
            <FormLabel color="#5B8FB9" fontWeight="bold">
              First Name
            </FormLabel>
            <Input
              type="text"
              bg="#B6EADA"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>
          <FormControl id="lastName">
            <FormLabel color="#5B8FB9" fontWeight="bold">
              Last Name
            </FormLabel>
            <Input
              type="text"
              bg="#B6EADA"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl id="newPassword">
            <FormLabel color="#5B8FB9" fontWeight="bold">
              New Password
            </FormLabel>
            <Input
              type="password"
              bg="#B6EADA"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmNewPassword">
            <FormLabel color="#5B8FB9" fontWeight="bold">
              Confirm New Password
            </FormLabel>
            <Input
              type="password"
              bg="#B6EADA"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </FormControl>

          <FormControl id="userProvidedPassword">
            <FormLabel color="#5B8FB9" fontWeight="bold">
              Current Password
            </FormLabel>
            <Input
              type="password"
              bg="#B6EADA"
              value={userProvidedPassword}
              onChange={(e) => setUserProvidedPassword(e.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
      <NeonButton onClick={handleUpdate} text="Update Information" />
    </VStack>
  );
}

export default AccountSettings;
