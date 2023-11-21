import { Container } from "@chakra-ui/layout";
import Content from "./Content/Content";
import Sidebar from "./Sidebar/Sidebar";

export default function UserProfile() {
  return (
    <div
      style={{
        marginTop: "10%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <Container display={{ base: "block", md: "flex",}} maxW="container.xl">
        <Sidebar />
        <Content />
      </Container>
    </div>
  );
}
