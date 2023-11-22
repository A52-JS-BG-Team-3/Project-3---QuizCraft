/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect} from "react";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from "../../../config/firebase-config";
import { fetchUserName } from "../../../services/user.service";
import { ref as dbRef, update, get } from 'firebase/database'

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const profileImage = useRef(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const uid = auth.currentUser.uid;
      const fetchedUserName = await fetchUserName(uid);
      setUserName(fetchedUserName);
  
      
      const userRef = dbRef(db, `users/${fetchedUserName}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUserProfile(userData.profileImage || null); 
      }
    };
  
    getCurrentUser();
  }, []);

  const openChooseImage = () => {
    profileImage.current.click();
  };
  const changeProfileImage = async (event) => {
    const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'jpg'];
    const selected = event.target.files[0];
  
    if (selected) {
      const fileName = selected.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
  
      if (ALLOWED_EXTENSIONS.includes(fileExtension)) {
        try {
          const storageRef = ref(storage, `profileAvatars/${userName}`);
          await uploadBytes(storageRef, selected);
  
          const downloadURL = await getDownloadURL(storageRef);
  
          setUserProfile(downloadURL);
  
          const userRef = dbRef(db, `users/${userName}`);
          update(userRef, { profileImage: downloadURL });
          alert('Avatar uploaded successfully');
        } catch (error) {
          console.error('Error uploading file to Firebase Storage:', error);
          onOpen();
        }
      } else {
        onOpen();
      }
    }
  };

  return (
    <VStack spacing={3} py={5} borderBottomWidth={1} borderColor="black">
      <Avatar
        size="2xl"
        name={userName}
        cursor="pointer"
        onClick={openChooseImage}
        src={userProfile}
      >
        <AvatarBadge bg="brand.blue" boxSize="1em">
          <svg width="0.4em" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </AvatarBadge>
      </Avatar>
      <input
        hidden
        type="file"
        ref={profileImage}
        onChange={changeProfileImage}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Something went wrong</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>File not supported!</Text>
            <HStack mt={1}>
              <Text color="brand.cadet" fontSize="sm">
                Supported types:
              </Text>
              <Badge colorScheme="green">PNG</Badge>
              <Badge colorScheme="green">JPG</Badge>
              <Badge colorScheme="green">JPEG</Badge>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing={1}>
      <Heading as="h3" fontSize="xl" color="brand.dark">
          {userName}'s Profile
        </Heading>
      </VStack>
    </VStack>
  );
}

export default Profile;
