import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/context";
import { Input, Button, Stack, Box, Text, Flex, useToast} from "@chakra-ui/react";
import { get, onValue, ref, set, off, remove } from "firebase/database";
import { db } from "../../config/firebase-config";
import { fetchUserName } from "../../services/user.service";
import { Link, useNavigate} from "react-router-dom";

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
    const quizzRef = ref(db, "quizzes");
    const unsubscribe = onValue(quizzRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedQuizz = Object.keys(data).map((key) => {
          const quiz = data[key];
          return {
            id: key,
            ...quiz,
          };
        });

        setAllQuizzes(loadedQuizz);
      }
    });

    return () => off(quizzRef, "value", unsubscribe);
  }, []);

  const handleSearchQuizz = () => {
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
      setFilteredQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
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
    <Flex justify="space-between" align="center" width="100%" height="100vh">
      <Box
        w="30%"
        ml={"2%"}
        mr={"2%"}
        align="center"
        rounded="lg"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
        bg="rgba(255, 255, 255, 0.3)"
        p={8}
        backdropFilter="blur(5px)"
      >
        <Stack spacing={4}>
          <Input
            placeholder="Search Quiz by title..."
            bg="#FFD580"
            mr={4}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize="sm"
            fontWeight={600}
            color="#332C30"
            bg="#DE6F3A"
            textDecoration="none"
            onClick={handleSearchQuizz}
            cursor="pointer"
            _hover={{
              bg: "#efa00b",
              color: "#332C30",
            }}
          >
            Search Quiz
          </Button>
          {filteredQuizzes.length > 0 && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Search Results:
              </Text>
              <Stack>
                {filteredQuizzes.map((quiz) => (
                  <Box key={quiz.id}>
                    <Text>Title: {quiz.title}</Text>
                    <Text>Author: {quiz.createdBy}</Text>
                    <Text>Category: {quiz.category}</Text>
                    <Text>Type: {quiz.type}</Text>
                    <Text>Time limit: {quiz.timeLimit} minutes</Text>
                    <Button
                      bg={"#DE6F3A"}
                      _hover={{
                        bg: "#efa00b",
                      }}
                      onClick={() => {
                        console.log("Go to Quizz clicked for quiz", quiz);
                        linkRef.current.click();
                      }}
                    >
                      Go to Quiz
                      <Link
                        to={`/quiz/${quiz.id}`}
                        ref={linkRef}
                        style={{ display: "none" }}
                      />
                    </Button>
                    <Button
                    colorScheme="red"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Delete Quiz
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleEditQuiz(quiz.id)}
                    mr={2}
                  >
                    Edit Quiz
                  </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
      <Box
        w="30%"
        ml={"2%"}
        mr={"2%"}
        align="center"
        rounded="lg"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
        bg="rgba(255, 255, 255, 0.3)"
        p={8}
        backdropFilter="blur(5px)"
      >
        <Stack spacing={4}>
          <Input
            focusBorderColor="brand.blue"
            placeholder="Search by username, email or name ..."
            type="text"
            bg="#FFD580"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"#332C30"}
            bg={"#DE6F3A"}
            textDecoration={"none"}
            cursor={"pointer"}
            onClick={handleSearch}
            _hover={{
              bg: "#efa00b",
              color: "#332C30",
            }}
          >
            Search for User
          </Button>

          {searchResults.length > 0 && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Search Results:
              </Text>
              <Stack>
                {searchResults.map((result) => (
                  <Box key={result.uid}>
                    <Text>Username: {result.userName}</Text>
                    <Text>
                      Full Name: {result.firstName} {result.lastName}
                    </Text>
                    <Text>Email: {result.email}</Text>
                    <Text>Status: {result.status}</Text>
                    <Button
                      bg={"#DE6F3A"}
                      _hover={{
                        bg: "#efa00b",
                      }}
                      onClick={() =>
                        updateUserStatus(
                          result.uid,
                          result.status === "active" ? "blocked" : "active"
                        )
                      }
                    >
                      {result.status === "active" ? "Block" : "Unblock"}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
