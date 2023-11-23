import { Box, Heading, VStack, Avatar, AvatarBadge } from '@chakra-ui/react';
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import fetchUser from '../../services/user.service';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, `groups/${groupId}`);

    const fetchGroupDetails = async () => {
      try {
        const snapshot = await get(groupRef);
        if (snapshot.exists()) {
          setGroup(snapshot.val());
          renderMembers(snapshot.val().members);
        } else {
          console.error('Group not found');
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    const renderMembers = async (members) => {
      const membersArray = await Promise.all(
        Object.values(members).map(async (member) => {
          const user = await fetchUser(member.userName);
          return {
            ...member,
            avatar: user ? user.avatar : null,
          };
        })
      );
      setMembers(membersArray);
    };

    fetchGroupDetails();
  }, [groupId]);

  return (
    <Box>
      <Heading mb={4} textAlign="center" color={"white"}>
        Group Details
      </Heading>
      {group && (
        <VStack align="center" spacing={4}>
          <Box borderWidth="1px" p={4} borderRadius="md" width="300px" color={"white"}>
            <Heading size="md">{group.name}</Heading>
            <p>Group ID: {groupId}</p>
            <p>Members:</p>
            <VStack>
              {members.map((member, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Avatar size="sm" name={member.userName} src={member.avatar}>
                    {!member.avatar && (
                      <AvatarBadge boxSize="1em">
                        <svg width="0.6em" fill="#fff" viewBox="0 0 20 20">
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="10">
                            {member.userName.charAt(0).toUpperCase()}
                          </text>
                        </svg>
                      </AvatarBadge>
                    )}
                  </Avatar>
                  <p>{member.userName}</p>
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default GroupDetails;
