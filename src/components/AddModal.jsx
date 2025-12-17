import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewObtainedChar,
  formatName,
  getAllArtifacts,
  getAllCharacters,
  getAllElements,
  getAllWeapons,
  getCharacterDetails,
  getWeaponDetails,
  myObtainedCharacters,
} from "../api";

const Overlay = (props) => {
  const [newChar, setNewChar] = useState({
    Name: "",
    Constellation: "",
    Weapon: "",
    Artifact: "",
    Element: "",
  });
  const [weaponType, setWeaponType] = useState("");
  const [error1, setError1] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Fetch all characters for character dropdown
  const queryAllChars = useQuery({
    queryKey: ["characters"],
    queryFn: getAllCharacters,
  });

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

  const queryMyChars = useQuery({
    queryKey: ["mychars"],
    queryFn: myObtainedCharacters,
    enabled: !!newChar.Name,
  });

  useEffect(() => {
    if (queryMyChars.isSuccess && queryMyChars.data && newChar.Name) {
      const isDuplicate = queryMyChars.data.find(
        (char) => char.fields.Name.toLowerCase() === newChar.Name.toLowerCase()
      );

      if (isDuplicate) {
        setError1("You already have this character");

        setNewChar((prev) => ({ ...prev, Name: "" }));
      } else {
        setError1("");
      }
    }
  }, [queryMyChars.isSuccess, queryMyChars.data, newChar.Name]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error === "Please fill in all fields") {
      setError("");
    }

    setNewChar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get Characters name, extract the vision type from the get individual char function, display the vision
  const queryCharDetails = useQuery({
    queryKey: ["char", newChar.Name],
    queryFn: () => getCharacterDetails(newChar.Name),
    enabled: !!newChar.Name,
  });

  // Effect is triggered when queryCharDetails is obtained
  useEffect(() => {
    if (queryCharDetails.isSuccess && queryCharDetails.data) {
      const visionData = queryCharDetails.data.vision;
      const weaponTypeData = queryCharDetails.data.weapon;

      setWeaponType(weaponTypeData);

      setNewChar((prev) => ({
        ...prev,
        Element: visionData,
      }));
    }
  }, [queryCharDetails.isSuccess, queryCharDetails.data]);

  const addNewCharMutate = useMutation({
    mutationFn: (charData) => addNewObtainedChar(charData),
    onSuccess: () => {
      queryClient.invalidateQueries(["mychars"]);
      props.setAddingNew(false);
    },
  });

  // Obtain weapon details
  const querySelectedWeapon = useQuery({
    queryKey: ["weapon", newChar.Weapon],
    queryFn: () => getWeaponDetails(newChar.Weapon),
    enabled: !!newChar.Weapon,
  });

  useEffect(() => {
    if (querySelectedWeapon.isSuccess && querySelectedWeapon.data) {
      const selectedWeaponType = querySelectedWeapon.data.type;
      if (weaponType !== selectedWeaponType) {
        setError(
          `Weapon type ${selectedWeaponType} cannot be used by the character`
        );
        setNewChar((prev) => ({ ...prev, Weapon: "" }));
      } else {
        setError("");
      }
    }
  }, [querySelectedWeapon.isSuccess, querySelectedWeapon.data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newChar.Constellation || !newChar.Artifact || !newChar.Weapon) {
      setError("Please fill in all fields");
      return;
    }

    addNewCharMutate.mutate(newChar);
  };

  const displayVision = newChar.Element;
  const charWeaponType = weaponType;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* DOUBLE CHECK THIS CLOSING */}
        <button onClick={() => props.setAddingNew(false)} className="close-btn">
          ×
        </button>
        <h2>Add New Character</h2>
        <div className="form-group">
          <label>Name</label>
          {/* SELECT NAME OPTIONS */}
          <select
            name="Name"
            value={newChar.Name}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select a character</option>
            {queryAllChars.isSuccess &&
              queryAllChars.data.map((char) => (
                <option key={char} value={char}>
                  {formatName(char)}
                </option>
              ))}
          </select>
          {error1 && <div className="error-message">{error1}</div>}
          {!error1 && newChar.Element === "" && <></>}
          {!error1 && newChar.Element && (
            <label className={`Element-${displayVision}`}>
              Element: {displayVision}
            </label>
          )}
          {!error1 && weaponType === "" && <></>}
          {!error1 && weaponType && (
            <label>Weapon Type: {charWeaponType}</label>
          )}

          {/* After character selected, addition options for constellation, weapon and artifact appear */}
          {!error1 && newChar.Name && (
            <div>
              <label>Constellation</label>
              <select
                name="Constellation"
                value={newChar.Constellation}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select constellation</option>
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
                value={newChar.Weapon}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a weapon</option>
                {queryAllWeapons.isSuccess &&
                  queryAllWeapons.data.map((weapon) => (
                    <option key={weapon} value={weapon}>
                      {formatName(weapon)}
                    </option>
                  ))}
              </select>
              <label>Artifact</label>
              {/* SELECT ARTIFACT OPTIONS */}
              <select
                name="Artifact"
                value={newChar.Artifact}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select an artifact set</option>
                {queryAllArtifacts.isSuccess &&
                  queryAllArtifacts.data.map((artifact) => (
                    <option key={artifact} value={artifact}>
                      {formatName(artifact)}
                    </option>
                  ))}
              </select>
              {error && <div className="error-message">{error}</div>}
              <button onClick={handleSubmit}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay setAddingNew={props.setAddingNew} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddModal;
