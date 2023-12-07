import {
  Box,
  Flex,
  IconButton,
  Stack,
  useColorModeValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NeonButton from "../NeonButton/NeonButton";
import { useContext } from "react";
import AppContext from "../../context/context";
import { UserPanel } from "./UserPanel/UserPanel";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { neonBoxShadowTurquoise } from "../BoxShadowsConts/boxshadows";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const { user } = useContext(AppContext);

  return (
    <Box className="nav">
      <Flex
       bg="#03001C"
        boxShadow={neonBoxShadowTurquoise}
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 1 }}
        px={{ base: 4, md: 4 }}
        align={"center"}
        justify="space-between"
        position="fixed"
        top={0}
        left={0}
        right={0}
        width="full"
        maxW="100%"
        m={0}
        p={0}
        height={{ base: "auto", md: "55px" }}
        zIndex={10}
      >
        <Image src={logo} alt="logo" height="60px" />
        <NavLink to="/">
        <Image src="src\assets\home_button.png" height="60px"/>
        </NavLink>

        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex as="nav" align="center" justify="center" wrap="wrap"></Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={{ base: "center", md: "flex-end" }}
          direction={"row"}
          spacing={6}
          pr={4}
          mr={4}
          ml={{ base: 0, md: "auto" }}
        >
          {user == null && <NeonButton text="Sign In" href="/signin" />}
          {user == null && <NeonButton text="Sign up" href="/signup" />}
          {user ? <UserPanel /> : null}
        </Stack>
      </Flex>
    </Box>
  );
}