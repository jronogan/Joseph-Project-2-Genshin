import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatName,
  getAllArtifacts,
  getAllCharacters,
  getAllElements,
  getAllWeapons,
  getCharacterDetails,
  getWeaponDetails,
  updateChar,
} from "../api";

const Overlay = (props) => {
  const [updatedChar, setUpdatedChar] = useState({
    id: props.id,
    Constellation: props.constellation,
    Weapon: props.weapon,
    Artifact: props.artifact,
  });
  const [error, setError] = useState("");
  const [weaponType, setWeaponType] = useState("");
  const queryClient = useQueryClient();

  // Fetch all characters for character dropdown
  const queryAllChars = useQuery({
    queryKey: ["characters"],
    queryFn: getAllCharacters,
  });

  // Specific Character
  const querySelectedCharacter = useQuery({
    queryKey: ["characterselected", props.name],
    queryFn: () => getCharacterDetails(props.name),
  });

  useEffect(() => {
    if (querySelectedCharacter.isSuccess && querySelectedCharacter.data) {
      const charWeaponType = querySelectedCharacter.data.weapon;
      console.log(charWeaponType);
      setWeaponType(charWeaponType);
    }
  }, [querySelectedCharacter.data, querySelectedCharacter.isSuccess]);

  // Fetch all weapons for character dropdown
  const queryAllWeapons = useQuery({
    queryKey: ["weapons"],
    queryFn: getAllWeapons,
  });

  //   Fetch all artifacts for character dropdown
  const queryAllArtifacts = useQuery({
    queryKey: ["artifacts"],
    queryFn: getAllArtifacts,
  });

  //   Fetch all elements (Need to change this since character element is already set)
  const queryAllElements = useQuery({
    queryKey: ["elements"],
    queryFn: getAllElements,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedChar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCharMutate = useMutation({
    mutationFn: (charData) => updateChar(charData),
    onSuccess: () => {
      queryClient.invalidateQueries(["mychars"]);
      props.setUpdatingChar(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (error) {
      setError("Wrong Weapon Type. Please Change.");
      return;
    }

    updateCharMutate.mutate(updatedChar);
  };

  // Obtain weapon details
  const querySelectedWeapon = useQuery({
    queryKey: ["weapon", updatedChar.Weapon],
    queryFn: () => getWeaponDetails(updatedChar.Weapon),
    enabled: !!updatedChar.Weapon,
  });

  useEffect(() => {
    if (!weaponType) return;

    if (querySelectedWeapon.isSuccess && querySelectedWeapon.data) {
      const selectedWeaponType = querySelectedWeapon.data.type;
      console.log(selectedWeaponType);
      if (weaponType !== selectedWeaponType) {
        setError(
          `Weapon type ${selectedWeaponType} cannot be used by the character`
        );
        return;
      } else {
        setError("");
      }
    }
  }, [querySelectedWeapon.isSuccess, querySelectedWeapon.data]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* DOUBLE CHECK THIS CLOSING */}
        <button
          onClick={() => props.setUpdatingChar(null)}
          className="close-btn"
        >
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Update {formatName(props.name)}'s Details</h2>
          <div className="form-group">
            <label>Constellation</label>
            {/* SELECT CONSTELLATION OPTIONS */}
            <select
              name="Constellation"
              value={updatedChar.Constellation}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Constellation}>
                {updatedChar.Constellation}
              </option>
              <option key="con0" value="0">
                0
              </option>
              <option key="con1" value="1">
                1
              </option>
              <option key="con2" value="2">
                2
              </option>
              <option key="con3" value="3">
                3
              </option>
              <option key="con4" value="4">
                4
              </option>
              <option key="con5" value="5">
                5
              </option>
              <option key="con6" value="6">
                6
              </option>
            </select>
            <label>Weapon</label>
            {/* SELECT WEAPON OPTIONS */}
            <select
              name="Weapon"
              value={updatedChar.Weapon}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Weapon}>
                {formatName(updatedChar.Weapon)}
              </option>
              {queryAllWeapons.isSuccess &&
                queryAllWeapons.data.map((weapon) => (
                  <option key={weapon} value={weapon}>
                    {formatName(weapon)}
                  </option>
                ))}
            </select>
            {error && <div className="error-message">{error}</div>}
            <label>Artifact</label>
            {/* SELECT ARTIFACT OPTIONS */}
            <select
              name="Artifact"
              value={updatedChar.Artifact}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Artifact}>
                {formatName(updatedChar.Artifact)}
              </option>
              {queryAllArtifacts.isSuccess &&
                queryAllArtifacts.data.map((artifact) => (
                  <option key={artifact} value={artifact}>
                    {formatName(artifact)}
                  </option>
                ))}
            </select>

            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpdateModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay
          setUpdatingChar={props.setUpdatingChar}
          id={props.id}
          name={props.name}
          constellation={props.constellation}
          weapon={props.weapon}
          artifact={props.artifact}
          element={props.element}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateModal;
