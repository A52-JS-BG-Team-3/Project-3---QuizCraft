import {
  Box,
  TabPanels,
  Tabs,
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
import Sidebar from "../Sidebar/Sidebar";
import NeonButton from "../../../components/NeonButton/NeonButton";
import { neonBoxShadowPurple } from "../../../components/BoxShadowsConts/boxshadows";

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
        justifyContent="space-between"
        bg={"#03001C"}
        width="70%"
        boxShadow={neonBoxShadowPurple}
        margin={"auto"}
      >
        <Tabs>
          <Box textAlign={"center"} fontWeight={"bold"} color="#5B8FB9" pt="1" pb="1">
            Account Settings
          </Box>

          <Divider orientation="horizontal" borderColor="#5B8FB9" color="#5B8FB9" />
          <TabPanels px={3} mt={5}>
            <Sidebar />
          {adminUserData && adminUserData.isAdmin && (
            <Link to="/adminpanel" style={{ textDecoration: "none" }}>
              <Flex justify="space-between" alignItems="center" pt="4">
                <NeonButton text="Admin Panel"/>
              </Flex>
            </Link>
          )}
            <AccountSettings />
          </TabPanels>
        </Tabs>
      </Box>
  );
};

export default Content;
