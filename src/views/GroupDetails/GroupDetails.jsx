import {
  Box,
  Heading,
  VStack,
  Avatar,
  AvatarBadge,
  Textarea,
  Button,
  Text,
} from "@chakra-ui/react";
import { get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";
import fetchUser from "../../services/user.service";
import { useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { neonBoxShadowPurple } from "../../components/BoxShadowsConts/boxshadows";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const groupRef = ref(db, `groups/${groupId}`);

    const fetchGroupDetails = async () => {
      try {
        const snapshot = await get(groupRef);
        if (snapshot.exists()) {
          setGroup(snapshot.val());
          setNewDescription(snapshot.val().description || "");
          renderMembers(snapshot.val().members);
        } else {
          console.error("Group not found");
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
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

  const toast = useToast();

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    const groupRef = ref(db, `groups/${groupId}`);
    await update(groupRef, { description: newDescription });

    setIsEditingDescription(false);
    toast({
      title: "Description Updated",
      description: "The group description has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
    w="20%"
    h="20%"
    >
      {group && (
        <VStack align="center" spacing={4}>
          <Box p={4} width="100%" color="#FFFFC7" textAlign="center" bg="#03001C" boxShadow={neonBoxShadowPurple}>
          <Heading mb={4} textAlign="center" color="#FFFFC7">
            {group.name}
          </Heading>
            {isEditingDescription ? (
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                mb={4}
              />
            ) : (
              <p>{group.description}</p>
            )}
            <Button
              onClick={
                isEditingDescription
                  ? handleSaveDescription
                  : handleEditDescription
              }
            >
              {isEditingDescription ? "Save Description" : "Edit Description"}
            </Button>
          </Box>
          <Box
            p={4}
            borderRadius="md"
            color={"white"}
            bg="#03001C"
            boxShadow={neonBoxShadowPurple}
          >
            <Text color="#FFFFC7">Members:</Text>
            <VStack>
              {members.map((member, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Avatar size="sm" name={member.userName} src={member.avatar}>
                    {!member.avatar && (
                      <AvatarBadge boxSize="1em">
                        <svg width="0.6em" fill="#fff" viewBox="0 0 20 20">
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="10"
                          >
                            {member.userName.charAt(0).toUpperCase()}
                          </text>
                        </svg>
                      </AvatarBadge>
                    )}
                  </Avatar>
                  <p>{member.userName}</p>
                  <Link to={`/teacherquizzes/${member.userName}`}>
                    <Button ml={2}>View Quizzes</Button>
                  </Link>
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
