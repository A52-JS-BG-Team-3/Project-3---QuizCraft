import { Button } from '@chakra-ui/react';
import './NeonButton.css';
import { NavLink } from 'react-router-dom';
const NeonButton = ({ text, onClick, href }) => {
  const buttonProps = {
    onClick: onClick,
    boxShadow: "0 0 5px #5B8FB9, 0 0 15px #5B8FB9, 0 0 20px #5B8FB9, 0 0 30px #5B8FB9",
    color: "#5B8FB9",
    fontWeight: "bold",
    fontSize: "15px",
    padding: "10px 20px",
    margin: "10px",
    _hover: {
      boxShadow: "0 0 15px #5B8FB9, 0 0 25px #5B8FB9, 0 0 35px #5B8FB9, 0 0 55px #5B8FB9",
      color: "#5B8FB9",
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
    <NavLink to={href} style={{ textDecoration: 'none' }}>
      <Button {...buttonProps}>{text}</Button>
    </NavLink>
  ) : (
    <Button {...buttonProps}>{text}</Button>
  );
};

export default NeonButton;
