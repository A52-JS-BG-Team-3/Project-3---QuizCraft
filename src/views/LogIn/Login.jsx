import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import AppContext from "../../context/context";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router";
import { db } from "../../config/firebase-config";
import { ref, get } from "@firebase/database";
import { fetchUserName } from "../../services/user.service";

function Login() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onLogin = async () => {
    try {
      if (!form.email) {
        alert("Email is required");
        return;
      }
      if (!form.password || form.password.length < 6) {
        alert("Password is required and must be at least 6 characters long");
        return;
      }

      const credential = await loginUser(form.email, form.password);
      setUser({
        user: credential.user,
      });

      const username = await fetchUserName(credential.user.uid);
      const userRef = ref(db, `users/${username}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        console.log("Login successful!");
        navigate("/home");
      } else {
        console.error("User data not found.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack
          align={"center"}
          bg="rgba(255, 255, 255, 0.3)"
          rounded="lg"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
          backdropFilter="blur(5px)"
        >
          <Heading fontSize={"4xl"} textAlign={"center"} color={"#332C30"}>
            Sign in
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            (づ๑•ᴗ•๑)づ♡
          </Text>
        </Stack>
        <Box
          align={"center"}
          rounded={"lg"}
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
          bg="rgba(255, 255, 255, 0.3)"
          p={8}
          backdropFilter="blur(5px)"
        >
          <FormLabel fontWeight={"bold"}>Email address</FormLabel>
          <Input
            isRequired
            type="email"
            value={form.email}
            onChange={updateForm("email")}
            mb={4}
            bg={"#FFD580"}
          />
          <FormLabel fontWeight={"bold"}>Password</FormLabel>
          <Input
            isRequired
            type="password"
            value={form.password}
            onChange={updateForm("password")}
            mb={6}
            bg={"#FFD580"}
          />
          <Checkbox mb={6} fontWeight={"bold"}>
            Remember me
          </Checkbox>
          <Text color={"#332C30"} mb={6} fontWeight={"bold"}>
            Forgot password?
          </Text>
          <Button
            onClick={onLogin}
            colorScheme={"blue"}
            variant={"solid"}
            bg={"#DE6F3A"}
            color={"#332C30"}
            _hover={{
              bg: "#efa00b",
            }}
          >
            Sign in
          </Button>
        </Box>
      </Stack>
    </div>
  );
}

export default Login;
