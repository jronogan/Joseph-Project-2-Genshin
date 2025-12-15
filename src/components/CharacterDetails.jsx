import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { EXT_BASE_URL, getCharacterDetails } from "../api";
import NavBar from "./NavBar";

const CharacterDetails = () => {
  const { name } = useParams();

  const queryCharDetails = useQuery({
    queryKey: ["character", name],
    queryFn: () => getCharacterDetails(name),
  });

  const charImageLink = `${EXT_BASE_URL}characters/${name}/card`;

  return (
    <>
      <NavBar />
      {queryCharDetails.isPending && <div>Loading {name} details...</div>}
      {queryCharDetails.isError && <div>{queryCharDetails.error.message}</div>}
      {queryCharDetails.isSuccess && (
        <div className="container details-container">
          <h2>{queryCharDetails.data.name}'s Details</h2>
          <dl>
            <dt>Name:</dt>
            <dd>{queryCharDetails.data.name}</dd>
            <img
              src={charImageLink}
              alt={`${queryCharDetails.data.name} card image`}
              style={{ maxWidth: "auto", height: "300px" }}
            />
            <dt>Vision:</dt>
            <dd>{queryCharDetails.data.vision}</dd>
            <dt>Weapon:</dt>
            <dd>{queryCharDetails.data.weapon}</dd>
            <dt>Rarity:</dt>
            <dd>{queryCharDetails.data.rarity}</dd>
            <dt>Skills:</dt>
            <dd>1: {queryCharDetails.data.skillTalents[0].name}</dd>
            <dd>2: {queryCharDetails.data.skillTalents[1].name}</dd>
            <dd>3: {queryCharDetails.data.skillTalents[2].name}</dd>
            <dt>Description:</dt>
            <dd>{queryCharDetails.data.description}</dd>
          </dl>
        </div>
      )}
    </>
  );
};

export default CharacterDetails;
