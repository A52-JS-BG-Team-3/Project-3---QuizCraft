import { useEffect, useState } from "react";
import { ref, get, query, orderByChild } from "firebase/database";
import { Box, List, Text } from "@chakra-ui/react";
import { db } from "../../config/firebase-config";

const neonBoxShadow = `
0 0 10px rgba(0, 255, 255, 0.8),
0 0 20px rgba(0, 255, 255, 0.8),
0 0 30px rgba(0, 255, 255, 0.8),
0 0 40px rgba(0, 255, 255, 0.8),
0 0 70px rgba(0, 255, 255, 0.8)
`;

const GlobalScoreboard = () => {
  const [scoreboard, setScoreboard] = useState([]);

  useEffect(() => {
    const fetchGlobalScoreboard = async () => {
      try {
        console.log("Fetching global scoreboard...");

        const attemptedRef = ref(db, "attempted");

        const attemptedSnapshot = await get(
          query(attemptedRef, orderByChild("userId"))
        );

        if (attemptedSnapshot.exists()) {
          const attemptedData = attemptedSnapshot.val();

          const totalPointsByUser = {};

          Object.keys(attemptedData).forEach((userId) => {
            Object.values(attemptedData[userId]).forEach((attempt) => {
              const points = attempt.score || 0;

              totalPointsByUser[userId] =
                (totalPointsByUser[userId] || 0) + points;
            });
          });

          const scoreboardArray = Object.keys(totalPointsByUser)
            .map((userId) => ({
              userId,
              totalPoints: totalPointsByUser[userId],
            }))
            .filter((user) => user.totalPoints > 0);

          console.log("Fetched data:", scoreboardArray);

          const sortedScoreboard = scoreboardArray.sort(
            (a, b) => b.totalPoints - a.totalPoints
          );

          setScoreboard(sortedScoreboard);
        } else {
          setScoreboard([]);
        }
      } catch (error) {
        console.error("Error fetching global scoreboard:", error);
      }
    };

    fetchGlobalScoreboard();
  }, []);

  return (
    <Box
      bg="#03001C"
      p={4}
      mb={4}
      boxShadow={neonBoxShadow}
      width="100%"
      mx="auto"
    >
      <Text color="#FFFFC7" fontSize="xl" fontWeight="bold" mb="4" textAlign="center">
        Global Scoreboard
      </Text>
      {scoreboard.length > 0 ? (
        <List textAlign="center">
          {scoreboard.map((user, index) => (
            <li key={user.userId}>
              <Text color="#5B8FB9">
                <strong>Rank {index + 1}:</strong> Student {user.userId} - Total
                Points: {user.totalPoints.toFixed(2)}
              </Text>
            </li>
          ))}
        </List>
      ) : (
        <Text color="white">No data to display.</Text>
      )}
    </Box>
  );
};

export default GlobalScoreboard;
