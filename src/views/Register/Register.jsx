"use client";

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useContext } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AuthContext from "../../context/context";
import { createUserHandle, getUserByHandle } from "../../services/user.service";
import { registerUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    phoneNumber: "",
  });

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onRegister = (event) => {
    event.preventDefault();
    if (!form.firstName) {
      alert("First name is required");
      return;
    }
    if (!form.lastName) {
      alert("Last name is required");
      return;
    }
    if (!form.email) {
      alert("Email is required");
      return;
    }
    if (!form.userName) {
      alert("Username is required!");
      return;
    }
    if (!form.phoneNumber) {
      alert("Phone number is required!");
      return;
    }
    if (!form.password && form.password.length < 6) {
      alert("Password is required and must be at least 6 characters long!");
      return;
    }
    if (
      form.firstName.length < 4 ||
      (form.firstName.length > 32 && form.lastName.length < 4) ||
      form.lastName.length > 32
    ) {
      alert("First and last names must be between 4 adn 32 symbols");
    }

    getUserByHandle(form.userName)
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert("User already exists");
          return;
        }

        return registerUser(form.email, form.password);
      })
      .then((credential) => {
        return createUserHandle({
          isAdmin: false,
          role: "student",
          uid: credential.user.uid,
          email: credential.user.email,
          phoneNumber: form.phoneNumber,
          userName: form.userName,
          firstName: form.firstName,
          lastName: form.lastName,
        }).then(() => {
          setUser({
            user: credential.user,
          });
        });
      })
      .then(() => {
        navigate("/home");
      });
    // Catch and userName errors
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
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            (ง ◉ _ ◉)ง
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "gray.700")}
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
          p={8}
          backdropFilter="blur(5px)"
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel fontWeight={"bold"}>First Name </FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={form.firstName}
                    onChange={updateForm("firstName")}
                    bg={"#FFD580"}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel fontWeight={"bold"}>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={form.lastName}
                    onChange={updateForm("lastName")}
                    bg={"#FFD580"}
                  />
                </FormControl>
              </Box>
            </HStack>
            <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel fontWeight={"bold"}>Username </FormLabel>
                <Input
                  type="text"
                  name="userName"
                  id="userName"
                  value={form.userName}
                  onChange={updateForm("userName")}
                  bg={"#FFD580"}
                />
              </FormControl>
            </Box>
            <FormControl id="email" isRequired>
              <FormLabel fontWeight={"bold"}>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={updateForm("email")}
                bg={"#FFD580"}
              />
              <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel fontWeight={"bold"}>Phone Number </FormLabel>
                <Input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={updateForm("phoneNumber")}
                  bg={"#FFD580"}
                />
              </FormControl>
            </Box>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel fontWeight={"bold"}>Password</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={updateForm("password")}
                  bg={"#FFD580"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={onRegister}
                loadingText="Submitting"
                border={"none"}
                bg={"#DE6F3A"}
                color={"#332C30"}
                _hover={{
                  bg: "#efa00b",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}></Stack>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
}
