import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatName, getAllCharacters } from "../api";

const Homepage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState("");

  const handleInput = (e) => {
    setSearchName(e.target.value);
  };
  const handleSearch = (name) => {
    if (searchName && queryAllChars.isSuccess && queryAllChars.data) {
      const nameFormat = formatName(name).trim();

      const exists = queryAllChars.data.find(
        (name) => formatName(name) === nameFormat
      );

      if (exists) {
        setError("");
        navigate(`/characters/${exists}`);
      } else {
        setError("Character does not exist");
      }
    }
  };

  const queryAllChars = useQuery({
    queryKey: ["characters"],
    queryFn: getAllCharacters,
    enabled: !!searchName,
  });

  return (
    <>
      <NavBar />
      <div className="search-section">
        <h1>WELCOME TO YOUR PERSONAL GENSHIN DATABASE</h1>
        <input
          type="text"
          placeholder="Search Character Name"
          value={searchName}
          onChange={handleInput}
        />
        <button onClick={() => handleSearch(searchName)}>
          Search Character
        </button>
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      </div>
    </>
  );
};

export default Homepage;
