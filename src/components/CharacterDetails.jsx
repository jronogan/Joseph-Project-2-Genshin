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
          <div className="char-image">
            <img
              src={charImageLink}
              alt={`${queryCharDetails.data.name} card image`}
            />
          </div>
          <dl>
            <dt>Name:</dt>
            <dd>{queryCharDetails.data.name}</dd>
            <dt>Vision:</dt>
            <dd className={`Element-${queryCharDetails.data.vision}`}>
              {queryCharDetails.data.vision}
            </dd>
            <dt>Weapon Type:</dt>
            <dd className={`weapon-${queryCharDetails.data.weapon}`}>
              {queryCharDetails.data.weapon}
            </dd>
            <dt>Rarity:</dt>
            <dd>{queryCharDetails.data.rarity}</dd>
            <dt>Skills:</dt>
            <dd>
              <div>1: {queryCharDetails.data.skillTalents[0].name}</div>
              <div>2: {queryCharDetails.data.skillTalents[1].name}</div>
              <div>3: {queryCharDetails.data.skillTalents[2].name}</div>
            </dd>
            <dt>Description:</dt>
            <dd>{queryCharDetails.data.description}</dd>
          </dl>
        </div>
      )}
    </>
  );
};

export default CharacterDetails;
