import {
  Box,
  Image,
  Checkbox,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import AppContext from "../../context/context";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router";
import { db, auth } from "../../config/firebase-config";
import { ref, get } from "@firebase/database";
import { fetchUserName } from "../../services/user.service";
import NeonButton from "../../components/NeonButton/NeonButton";
import { useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";


const neonBoxShadow = `
  0 0 10px rgba(253, 253, 150, 0.8),
  0 0 20px rgba(253, 253, 150, 0.8),
  0 0 30px rgba(253, 253, 150, 0.8),
  0 0 40px rgba(253, 253, 150, 0.8),
  0 0 70px rgba(253, 253, 150, 0.8)
`;

function Login() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Added loading state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false); // Set loading to false when auth state is known
      if (user) {
        setUser(user);
        navigate('/'); // Redirect to home if already logged in
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [setUser, navigate]);

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
        navigate("/");
      } else {
        console.error("User data not found.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Stack spacing={8} mx={"auto"} maxW={{ base: "90%", sm: "80%", md: "60%", lg: "40%" }} py={12} px={6}>
        <Image src="src\assets\are_you_ready.png"></Image>
        <Box
          align={"center"}
          boxShadow={neonBoxShadow}
          bg="#03001C"
          p={8}
          backdropFilter="blur(5px)"
        >
          <FormLabel fontWeight={"bold"} color="#5B8FB9">
            Email address
          </FormLabel>
          <Input
            isRequired
            type="email"
            value={form.email}
            onChange={updateForm("email")}
            mb={4}
            bg="#B6EAD"
          />
          <FormLabel fontWeight={"bold"} color="#5B8FB9">
            Password
          </FormLabel>
          <Input
            isRequired
            type="password"
            value={form.password}
            onChange={updateForm("password")}
            mb={6}
            bg="#B6EAD"
          />
          <Checkbox mb={6} fontWeight={"bold"} color="#5B8FB9">
            Remember me
          </Checkbox>
          <Text color="#5B8FB9" mb={6} fontWeight={"bold"}>
            Forgot password?
          </Text>
          <NeonButton text="Log In" onClick={onLogin} />
        </Box>
      </Stack>
    </Box>
  );
}

export default Login;
