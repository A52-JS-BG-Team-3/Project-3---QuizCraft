import { Button } from '@chakra-ui/react';
import './NeonButton.css';
const NeonButton = ({ text, onClick }) => {
  return (
    <Button
        className="neon-button"
        onClick={onClick}
        boxShadow="0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff, 0 0 80px #00d5ff"
        color="#00d5ff"
        fontWeight="bold"
        fontSize="15px"
        borderRadius="10px"
        padding="10px 20px"
        margin="10px"
        _hover={{
          boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
          color: "#00d5ff",
        }}
        _active={{
          boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
          color: "#00d5ff",
        }}
        _focus={{
          boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
          color: "#00d5ff",
        }}

    >
      {text}
    </Button>
  );
};

export default NeonButton;
