/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/context";
import {
  Input,
  Button,
  Stack,
  Box,
  Text,
  Flex,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Heading,
} from "@chakra-ui/react";
import { get, onValue, ref, set, off, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { fetchUserName } from "../../services/user.service";
import { Link, useNavigate } from "react-router-dom";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";
import NeonButton from "../../components/NeonButton/NeonButton";

export default function AdminPanel() {
  const linkRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const { user } = useContext(AppContext);
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      if (user) {
        const adminUserName = await fetchUserName(user.uid);
        const adminUsersRef = ref(db, `users/${adminUserName}`);
        const adminSnapshot = await get(adminUsersRef);
        if (adminSnapshot.exists()) {
          const adminUserData = adminSnapshot.val();
          setAdminUser(adminUserData);
        }
      }

      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();

        const results = Object.values(usersData).filter(
          (userData) =>
            (userData &&
              userData.userName &&
              userData.userName.includes(query)) ||
            (userData.email && userData.email.includes(query)) ||
            (userData.firstName && userData.firstName.includes(query)) ||
            (userData.lastName && userData.lastName.includes(query))
        );

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (user !== null) {
          const adminUserName = await fetchUserName(user.uid);
          const adminUsersRef = ref(db, `users/${adminUserName}`);
          const adminSnapshot = await get(adminUsersRef);
          if (adminSnapshot.exists()) {
            const adminUserData = adminSnapshot.val();
            setAdminUser(adminUserData);
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [user]);

  const updateUserStatus = async (uid, newStatus) => {
    try {
      const userRef = ref(db, `users`);
      const usersSnapshot = await get(userRef);

      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();

        const username = Object.keys(usersData).find(
          (key) => usersData[key].uid === uid
        );

        if (username) {
          const userToUpdate = usersData[username];
          userToUpdate.status = newStatus;

          handleSearch();

          await set(ref(db, `users/${username}`), userToUpdate);
          toast({
            title: "User status updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log("User status updated successfully:", userToUpdate);
        } else {
          console.error("No users found with UID:", uid);
        }
      } else {
        console.error("No users found in the database.");
      }
    } catch (error) {
      toast({
        title: "Error updating user status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error updating user status:", error);
    }
  };

  useEffect(() => {
    const quizRef = ref(db, "quizzes");
    const unsubscribe = onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedQuiz = Object.keys(data).map((key) => {
          const quiz = data[key];
          return {
            id: key,
            ...quiz,
          };
        });

        setAllQuizzes(loadedQuiz);
      }
    });

    return () => off(quizRef, "value", unsubscribe);
  }, []);

  const handleSearchQuiz = () => {
    const queries = searchQuery.toLowerCase().split(" ");
    const filtered = allQuizzes.filter((quiz) => {
      return queries.every((query) => quiz.title.toLowerCase().includes(query));
    });
    setFilteredQuizzes(filtered);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const quizRef = ref(db, `quizzes/${quizId}`);
      await remove(quizRef);
      setFilteredQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
      toast({
        title: "Quiz deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({
        title: "Error deleting quiz",
        description: "An error occurred while deleting the quiz.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      width="90%"
      mx="auto"
      mt={10}
      p={5}
      borderRadius="lg"
      boxShadow={neonBoxShadowPurple}
      bg="#03001C"
    >
      <Heading
        as="h1"
        size="xl"
        mb={6}
        textAlign="center"
        className="glowing-heading"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Welcome Senpai
      </Heading>
      <Box w="100%" align="center" bg="" p={8}>
        <Stack spacing={4}>
          <Input
            placeholder="Search Quiz by title..."
            bg="#B6EADA"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <NeonButton onClick={handleSearchQuiz} text="Search Quiz" />
          {filteredQuizzes.length > 0 && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="#FFFFC7">
                Search Results:
              </Text>
              <Table variant="striped" colorScheme="black" size="sm">
                <Thead>
                  <Tr>
                    <Th textColor="#5B8FB9">Title</Th>
                    <Th textColor="#5B8FB9">Author</Th>
                    <Th textColor="#5B8FB9">Category</Th>
                    <Th textColor="#5B8FB9">Type</Th>
                    <Th textColor="#5B8FB9">Time limit</Th>
                    <Th textColor="#5B8FB9">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredQuizzes.map((quiz) => (
                    <Tr key={quiz.id}>
                      <Td textColor="#5B8FB9">{quiz.title}</Td>
                      <Td textColor="#5B8FB9">{quiz.createdBy}</Td>
                      <Td textColor="#5B8FB9">{quiz.category}</Td>
                      <Td textColor="#5B8FB9">{quiz.type}</Td>
                      <Td textColor="#5B8FB9">{quiz.timeLimit} minutes</Td>
                      <Td textColor="#5B8FB9">
                        <NeonButton
                          text="Edit Quiz"
                          onClick={() => handleEditQuiz(quiz.id)}
                        />
                        <NeonButton
                          text="Delete Quiz"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Stack>
      </Box>
      <Box w="100%" align="center" p={8}>
        <Stack spacing={4}>
          <Input
            focusBorderColor="#FFFFC7"
            placeholder="Search by username, email or name ..."
            type="text"
            bg="#B6EADA"
            onChange={(e) => setQuery(e.target.value)}
          />

          <NeonButton text="Search for User" onClick={handleSearch} />

          {searchResults.length > 0 && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="#FFFFC7">
                Search Results:
              </Text>
              <Table variant="striped" colorScheme="black" size="sm">
                <Thead>
                  <Tr>
                    <Th textColor="#5B8FB9">Username</Th>
                    <Th textColor="#5B8FB9">Full Name</Th>
                    <Th textColor="#5B8FB9">Email</Th>
                    <Th textColor="#5B8FB9">Status</Th>
                    <Th textColor="#5B8FB9">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchResults.map((result) => (
                    <Tr key={result.uid}>
                      <Td textColor="#5B8FB9">{result.userName}</Td>
                      <Td textColor="#5B8FB9">{`${result.firstName} ${result.lastName}`}</Td>
                      <Td textColor="#5B8FB9">{result.email}</Td>
                      <Td textColor="#5B8FB9">{result.status}</Td>
                      <Td textColor="#5B8FB9">
                        <NeonButton
                          text={
                            result.status === "active" ? "Block" : "Unblock"
                          }
                          onClick={() =>
                            updateUserStatus(
                              result.uid,
                              result.status === "active" ? "blocked" : "active"
                            )
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
