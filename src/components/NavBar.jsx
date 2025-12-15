import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link to="/">Homepage</Link>
      <Link to="/characters">All Characters</Link>
      <Link to="/weapons">All Weapons</Link>
      <Link to="/myCharacters">My Characters</Link>
    </div>
  );
};

export default NavBar;
