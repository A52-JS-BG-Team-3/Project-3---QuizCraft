import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Image,
  useToast,
  Stack,
  Text,
  Select,
} from "@chakra-ui/react";
import quizTimeImage from "../../assets/quiz_time.png";
import "./TeacherProfile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../../config/firebase-config";
import { ref, get, push, set } from "firebase/database";
import { fetchUserName } from "../../services/user.service";

const neonBoxShadow = `
  0 0 10px rgba(200, 50, 200, 0.8),
  0 0 20px rgba(200, 50, 200, 0.8),
  0 0 30px rgba(200, 50, 200, 0.8),
  0 0 40px rgba(200, 50, 200, 0.8),
  0 0 70px rgba(200, 50, 200, 0.8)
`;

const TeacherProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [highlightedUser, setHighlightedUser] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = ref(db, "quizzes");
        const quizzesSnapshot = await get(quizzesRef);

        if (quizzesSnapshot.exists()) {
          const quizzesData = quizzesSnapshot.val();
          const quizList = Object.values(quizzesData).map((quiz) => ({
            quizId: quiz.uid,
            title: quiz.title,
          }));
          setQuizzes(quizList);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userNameData = await fetchUserName(auth.currentUser.uid);

        if (userNameData) {
          setUserName(userNameData);
        } else {
          console.error("Error fetching user name.");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearchStudents = async () => {
    try {
      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();

        const results = Object.values(usersData).filter(
          (userData) =>
            (userData &&
              userData.userName &&
              userData.userName.includes(searchQuery)) ||
            (userData.email && userData.email.includes(searchQuery)) ||
            (userData.firstName && userData.firstName.includes(searchQuery)) ||
            (userData.lastName && userData.lastName.includes(searchQuery))
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSendInvitation = async () => {
    try {
      if (!selectedUser || selectedQuizId === null) {
        toast({
          title:
            "Please select a user and a quiz before sending an invitation.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const invitationsRef = ref(db, "invitations");
      const newInvitationRef = push(invitationsRef);

      const invitationData = {
        senderUid: auth.currentUser.uid,
        receiverUid: selectedUser.uid,
        quizId: selectedQuizId,
        status: "pending",
        timestamp: new Date().toISOString(),
      };

      await set(newInvitationRef, invitationData);

      toast({
        title: `Invitation sent to user with username: ${selectedUser.userName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setSelectedUser(null);
      setSelectedQuizId(null);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error sending invitation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleViewResults = (selectedUser) => {
    // Ensure both user and quiz are selected
    if (!selectedUser) {
      toast({
        title: "Please select a user and a quiz before viewing results.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

   
    navigate(`/quizresults/${selectedUser.userName}`);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setHighlightedUser(user);
  };

  const handleUserMouseEnter = (user) => {
    setHighlightedUser(user);
  };

  const handleUserMouseLeave = () => {
    setHighlightedUser(null);
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
  };

  return (
    <Box
      pt={{ base: "100px", md: "120px" }}
      px={{ base: "5", md: "10" }}
      boxShadow={neonBoxShadow}
      bg="#03001C"
    >
      <Flex direction="column" align="center" maxWidth="1200px" margin="0 auto">
        <Heading
          as="h1"
          size="xl"
          mb={6}
          textAlign="center"
          className="glowing-heading"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Welcome, {userName}
        </Heading>
        <Flex align="center" justify="center" width="full">
          <Box mr={10}>
            {" "}
            <Image src={quizTimeImage} className="floating-image" />
          </Box>
          <VStack spacing={4} align="stretch" width="full" maxW="lg">
            {" "}
            <Input
              placeholder="Search Students..."
              bg="white"
              size="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              colorScheme="blue"
              width="full"
              onClick={handleSearchStudents}
            >
              Search
            </Button>
            <Stack>
              {searchResults.map((result) => (
                <Box
                  key={result.uid}
                  color="white"
                  onClick={() => handleUserSelect(result)}
                  onMouseEnter={() => handleUserMouseEnter(result)}
                  onMouseLeave={handleUserMouseLeave}
                  style={{
                    cursor: "pointer",
                    background:
                      highlightedUser && highlightedUser.uid === result.uid
                        ? "#cbd5e0"
                        : "transparent",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    transition: "background 0.3s",
                  }}
                >
                  <Text>Username: {result.userName}</Text>
                  <Text>
                    Full Name: {result.firstName} {result.lastName}
                  </Text>
                  <Text>Email: {result.email}</Text>
                </Box>
              ))}
            </Stack>
            <Select
              placeholder="Select Quiz"
              bg="white"
              size="lg"
              value={selectedQuizId}
              onChange={(e) => handleQuizSelect(e.target.value)}
            >
              {quizzes.map((quiz) => (
                <option key={quiz.quizId} value={quiz.quizId}>
                  {quiz.title}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="teal"
              width="full"
              onClick={handleSendInvitation}
            >
              Send Invitation
            </Button>
            <Button
              colorScheme="green"
              width="full"
              onClick={() => navigate("/createquiz")}
            >
              Create Quiz
            </Button>
            <Button
              colorScheme="purple"
              width="full"
              onClick={() => navigate("/userquizzes")}
            >
              My Quizzes
            </Button>
            <Button
              colorScheme="green"
              onClick={() => handleViewResults(selectedUser, selectedQuizId)}
            >
              View Results
            </Button>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TeacherProfile;
