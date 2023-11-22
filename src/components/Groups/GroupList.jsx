// GroupList.jsx
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Box,Heading, VStack } from '@chakra-ui/react';

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupsRef = ref(db, 'groups');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupsArray = Object.entries(snapshot.val()).map(([id, group]) => ({
          id,
          ...group,
        }));
        setGroups(groupsArray);
      } else {
        setGroups([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box>
      <Heading mb={4} textAlign="center" color={"white"}>
        Group List
      </Heading>
      <VStack align="center" spacing={4}>
        {groups.map((group) => (
          <Box key={group.id} borderWidth="1px" p={4} borderRadius="md" width="300px" color={"white"}>
            <Heading size="md">{group.name}</Heading>
            <p>Group ID: {group.id}</p>
          </Box>
        ))}
        {groups.length === 0 && <p>No groups available</p>}
      </VStack>
    </Box>
  );
};

export default GroupList;