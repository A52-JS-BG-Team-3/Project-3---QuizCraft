import {
    Box,
    TabPanels,
    Tabs,
    Text,
    Button,
    Flex,
    Divider,
  } from "@chakra-ui/react";
  import AccountSettings from "./AccountSettings";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/context";
import { fetchUserName } from "../../../services/user.service";
import { ref, get } from "firebase/database";
import { db } from "../../../config/firebase-config";
import { Link } from "react-router-dom";

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
      <Box
        as="main"
        flex={3}
        d="flex"
        flexDir="column"
        justifyContent="space-between"
        pt={5}
        rounded="md"
        borderWidth={1}
        border={"none"}
        style={{ transform: "translateY(-100px)" }}
        boxShadow={
          "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
        }
        bg="rgba(255, 255, 255, 0.3)"
        backdropFilter="blur(5px)"
      >
        <Tabs>
          <Box textAlign={"center"} fontWeight={"bold"}>
            Account Settings
          </Box>
          <Text textAlign={"center"}>🥺</Text>
          <Text textAlign={"center"}>👉👈</Text>
          <Divider orientation="horizontal" borderColor="#332C30" />
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
            <AccountSettings />
          </TabPanels>
        </Tabs>
      </Box>
    );
  };
  
  export default Content;
  