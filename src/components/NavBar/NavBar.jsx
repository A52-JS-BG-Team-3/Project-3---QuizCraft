import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    useColorModeValue,
    useDisclosure,
  } from "@chakra-ui/react";
  import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NeonButton from "../NeonButton/NeonButton";

  export default function WithSubnavigation() {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Box className="nav">
        <Flex
          bg="rgba(255, 255, 255, 0.3)"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)"
          backdropFilter="blur(5px)"
          color={useColorModeValue("gray.600", "white")}
          py={{ base: 1 }}
          px={{ base: 4, md: 4 }}
          borderColor={useColorModeValue("gray.200", "gray.900")}
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
          borderRadius="10px"
        >
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
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            pr={4}
            mr={4}
          >
            <NeonButton text="Home" />
            <NeonButton text="Sign in" />
          </Stack>
        </Flex>
  
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    );
  }
  
  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue("white", "gray.800")}
        p={4}
        display={{ md: "none" }}
      >
        <Box as="a" href="#" py={2} _hover={{ textDecoration: "none", }}>
          <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>Mobile Link 1</Text>
        </Box>
        <Box as="a" href="#" py={2} _hover={{ textDecoration: "none", }}>
          <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>Mobile Link 2</Text>
        </Box>
      </Stack>
    );
  };
  