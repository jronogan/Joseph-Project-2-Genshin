import React from "react";
import NavBar from "./NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EXT_BASE_URL, formatName, getAllCharacters } from "../api";
import { Link, Route, Routes } from "react-router-dom";

const AllCharacters = () => {
  const queryClient = useQueryClient();

  const queryAllChars = useQuery({
    queryKey: ["characters"],
    queryFn: getAllCharacters,
  });

  return (
    <>
      <NavBar />
      <div className="container list-section">
        <h1>All Genshin Characters</h1>
        <Link to="/myCharacters" className="view-my-chars-link">
          View My Characters
        </Link>
        {/* Obtain List of All Characters */}
        {queryAllChars.isPending && (
          <div className="loading-spinner">...Loading</div>
        )}
        {queryAllChars.isError && (
          <div className="error-message">{queryAllChars.error.message}</div>
        )}
        {queryAllChars.isSuccess && (
          <ul className="characters-list">
            {queryAllChars.data.map((char) => (
              <li key={char}>
                <Link to={`/characters/${char}`}>{formatName(char)}</Link>
                <img
                  src={`${EXT_BASE_URL}characters/${char}/card`}
                  alt={`${char} card image`}
                  className="char-main-image"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AllCharacters;
