import React from "react";
import NavBar from "./NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EXT_BASE_URL, formatName, getAllWeapons } from "../api";
import { Link } from "react-router-dom";

const AllWeapons = () => {
  const queryClient = useQueryClient();

  const queryAllWeap = useQuery({
    queryKey: ["weapons"],
    queryFn: getAllWeapons,
  });

  return (
    <>
      <NavBar />
      <div className="container list-section">
        <h1>All Genshin Weapons</h1>
        {/* Obtain List of All Weapons */}
        {queryAllWeap.isPending && <p>...Loading</p>}
        {queryAllWeap.isError && <p>{queryAllWeap.error.message}</p>}
        {queryAllWeap.isSuccess && (
          <ul className="characters-list">
            {queryAllWeap.data.map((weapon) => (
              <li key={weapon}>
                <Link to={`/weapons/${weapon}`}>{formatName(weapon)}</Link>
                <div className="char-icon">
                  <img
                    src={`${EXT_BASE_URL}weapons/${weapon}/icon`}
                    alt={`${weapon} icon`}
                    className="weapon-icon"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AllWeapons;
