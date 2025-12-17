import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { EXT_BASE_URL, getWeaponDetails } from "../api";
import NavBar from "./NavBar";

const WeaponDetails = () => {
  const { name } = useParams();

  const queryWeapDetails = useQuery({
    queryKey: ["weapon", name],
    queryFn: () => getWeaponDetails(name),
  });

  const weaponImageLink = `${EXT_BASE_URL}weapons/${name}/icon`;

  return (
    <>
      <NavBar />
      {queryWeapDetails.isPending && <div>Loading {name} details...</div>}
      {queryWeapDetails.isError && <div>{queryWeapDetails.error.message}</div>}
      {queryWeapDetails.isSuccess && (
        <div className="container details-container">
          <h2>{queryWeapDetails.data.name}'s Details</h2>
          <div className="weapon-image">
            <img
              src={weaponImageLink}
              alt={`${queryWeapDetails.data.name} card image`}
            />
          </div>
          <dl>
            <dt>Name:</dt>
            <dd>{queryWeapDetails.data.name}</dd>
            <dt>Type:</dt>
            <dd>{queryWeapDetails.data.type}</dd>
            <dt>Rarity:</dt>
            <dd>{queryWeapDetails.data.rarity}</dd>
            <dt>Base Attack:</dt>
            <dd>{queryWeapDetails.data.baseAttack}</dd>
            <dt>Substat:</dt>
            <dd>{queryWeapDetails.data.subStat}</dd>
            <dt>Description:</dt>
            <dd>{queryWeapDetails.data.passiveDesc}</dd>
          </dl>
        </div>
      )}
    </>
  );
};

export default WeaponDetails;
