import React from "react";
import NavBar from "./NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCharacters } from "../api";
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
        {queryAllChars.isPending && <p>...Loading</p>}
        {queryAllChars.isError && <p>{queryAllChars.error.message}</p>}
        {queryAllChars.isSuccess && (
          <ul className="characters-list">
            {queryAllChars.data.map((char) => (
              <li key={char}>
                <Link to={`/characters/${char}`}>{char}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AllCharacters;
