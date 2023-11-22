import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  Button,
} from "@chakra-ui/react";
import { db, auth } from "../../../config/firebase-config";
import { ref, get, update } from "firebase/database";
import { fetchUserName} from "../../../services/user.service";

function AccountSettings() {
  const currentUserUid = auth.currentUser.uid;
  const [userName, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

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
          setPassword(user.password || "");
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
    try {
      await update(usersRef, {
        firstName,
        lastName,
        password,
      });
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      gap={6}
    >
      <Grid xs={12} md={6}>
        <FormControl id="firstName">
          <FormLabel fontWeight="bold">First Name</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="text"
            bg="#FFD580"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormControl>
        <FormControl id="lastName">
          <FormLabel fontWeight="bold">Last Name</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="text"
            bg="#FFD580"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel fontWeight="bold">Password</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="password"
            bg="#FFD580"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid xs={12} md={6} justifyContent="center">
      </Grid>
      <FormLabel fontWeight="bold">
        "People, who can’t throw something important away, can never hope to
        change anything." ~ Armin Arlert{" "}
      </FormLabel>

      <Button
        onClick={handleUpdate}
        fontSize={"sm"}
        fontWeight={600}
        color={"#332C30"}
        bg={"#DE6F3A"}
        _hover={{
          bg: "#efa00b",
          color: "#332C30",
        }}
      >
        Update Information
      </Button>
    </Grid>
  );
}

export default AccountSettings;
