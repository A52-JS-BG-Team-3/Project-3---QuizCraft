import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  Flex,
  Select,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import AuthContext from "../../context/context";
import { createUserHandle, getUserByHandle } from "../../services/user.service";
import { registerUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import NeonButton from "../../components/NeonButton/NeonButton";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";

export default function Register() {
  const [selectedRole, setSelectedRole] = useState("student");
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

  const updateRole = (e) => {
    setSelectedRole(e.target.value);
  };
  const toast = useToast();

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onRegister = async (event) => {
    event.preventDefault();

    try {
      if (
        !form.firstName ||
        !form.lastName ||
        !form.email ||
        !form.userName ||
        !form.phoneNumber ||
        !form.password ||
        form.password.length < 6 ||
        form.firstName.length < 4 ||
        form.firstName.length > 32 ||
        form.lastName.length < 4 ||
        form.lastName.length > 32
      ) {
        throw new Error("Invalid input. Please check your form data.");
      }

      if (!form.phoneNumber || !/^\d{10}$/.test(form.phoneNumber)) {
        throw new Error("Invalid phone number. Please enter 10 digits.");
      }

      const snapshot = await getUserByHandle(form.userName);

      if (snapshot.exists()) {
        throw new Error("User already exists");
      }

      const credential = await registerUser(form.email, form.password);

      await createUserHandle({
        isAdmin: false,
        status: "active",
        role: selectedRole,
        uid: credential.user.uid,
        email: credential.user.email,
        phoneNumber: form.phoneNumber,
        userName: form.userName,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      setUser({
        user: credential.user,
      });

      navigate("/");
      toast({
        title: "Registration successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error during registration:", error);

      toast({
        title: "Error during registration.",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pt={{ base: "1%", md: "5%" }}
      pb="1%"
    >
      <Stack
        spacing={8}
        width={{ base: "90%", sm: "80%", md: "60%", lg: "30%" }}
        height="100% !important"
      >
        <Box
          height="100% !important"
          bg="#03001C"
          boxShadow={neonBoxShadowPurple}
          p={{ base: 6, md: 12 }}
        >
          <Image src="src/assets/logo.png" alt="logo" height="60px" mx="auto" />
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            flexWrap={"wrap"}
            spa
          >
            <Stack spacing={4} flex="1" mr={4}>
              <FormControl id="firstName" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  First Name
                </FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={form.firstName}
                  onChange={updateForm("firstName")}
                  bg="#B6EADA"
                />
              </FormControl>
              <FormControl id="lastName" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Last Name
                </FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={form.lastName}
                  onChange={updateForm("lastName")}
                  bg="#B6EADA"
                />
              </FormControl>
              <FormControl id="userName" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Username
                </FormLabel>
                <Input
                  type="text"
                  name="userName"
                  id="userName"
                  value={form.userName}
                  onChange={updateForm("userName")}
                  bg="#B6EADA"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={updateForm("email")}
                  bg="#B6EADA"
                />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Phone Number
                </FormLabel>
                <Input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={updateForm("phoneNumber")}
                  bg="#B6EADA"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={form.password}
                    onChange={updateForm("password")}
                    bg="#B6EADA"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="role" isRequired>
                <FormLabel fontWeight="bold" color="#5B8FB9">
                  Select Role
                </FormLabel>
                <Select value={selectedRole} onChange={updateRole} bg="#B6EADA">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Select>
              </FormControl>
              <NeonButton
                text="Sign Up"
                onClick={onRegister}
                loadingText="Submitting"
              />
            </Stack>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
}
