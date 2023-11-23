import {
  Box,
  TabPanels,
  Tabs,
  Button,
  Flex,
  Divider,
  Center
} from "@chakra-ui/react";
import AccountSettings from "./AccountSettings";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/context";
import { fetchUserName } from "../../../services/user.service";
import { ref, get } from "firebase/database";
import { db } from "../../../config/firebase-config";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const neonBoxShadow = `
  0 0 10px rgba(200, 200, 9, 0.8),
  0 0 20px rgba(200, 200, 9, 0.8),
  0 0 30px rgba(200, 200, 9, 0.8),
  0 0 40px rgba(200, 200, 9, 0.8),
  0 0 70px rgba(200, 200, 9, 0.8)
`;

const Content = () => {
  const { user } = useContext(AppContext);
  const [adminUserData, setAdminUserData] = useState(null);

  useEffect(() => {
    const fetchAdminUserData = async () => {
      if (user && user.uid) {
        try {
          const adminUserName = await fetchUserName(user.uid);
          const adminUsersRef = ref(db, `users/${adminUserName}`);
          const adminSnapshot = await get(adminUsersRef);
          if (adminSnapshot.exists()) {
            setAdminUserData(adminSnapshot.val());
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
    };

    fetchAdminUserData();
  }, [user]);

  return (
    <Center>
      <Box
        as="main"
        flex={3}
        d="flex"
        flexDirection="column"
        justifyContent="space-between"
        bg={"#03001C"}
        width={{ base: "90%", md: "70%" }}
        boxShadow={neonBoxShadow}
        margin="auto" // Center the box horizontally
      >
        <Tabs>
          <Box textAlign={"center"} fontWeight={"bold"} color="#5B8FB9">
            Account Settings
          </Box>

          <Divider orientation="horizontal" borderColor="#5B8FB9" color="#5B8FB9" />
          {adminUserData && adminUserData.isAdmin && (
            <Link to="/adminpanel" style={{ textDecoration: "none" }}>
              <Flex justify="space-between" alignItems="center" pt="4">
                <Button
                  as="div"
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"sm"}
                  fontWeight={600}
                  pt={""}
                  color={"#332C30"}
                  bg={"#DE6F3A"}
                  textDecoration={"none"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "#efa00b",
                    color: "#332C30",
                  }}
                  ml="auto"
                  width="50%"
                >
                  Admin Panel
                </Button>
              </Flex>
            </Link>
          )}
          <TabPanels px={3} mt={5}>
            <Sidebar />
            <AccountSettings />
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};

export default Content;
