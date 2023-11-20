import { Button } from '@chakra-ui/react';
import './NeonButton.css';
const NeonButton = ({ text, onClick, href }) => {
  const buttonProps = {
    onClick: onClick,
    boxShadow: "0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff, 0 0 80px #00d5ff",
    color: "#00d5ff",
    fontWeight: "bold",
    fontSize: "15px",
    borderRadius: "10px",
    padding: "10px 20px",
    margin: "10px",
    _hover: {
      boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
      color: "#00d5ff",
    },
    _active: {
      boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
      color: "#00d5ff",
    },
    _focus: {
      boxShadow: "0 0 5px #00d5ff, 0 0 10px #00d5ff, 0 0 20px #00d5ff, 0 0 40px #00d5ff",
      color: "#00d5ff",
    },
  };

  return href ? (
    <a href={href} style={{ textDecoration: 'none' }}>
      <Button {...buttonProps}>{text}</Button>
    </a>
  ) : (
    <Button {...buttonProps}>{text}</Button>
  );
};

export default NeonButton;
