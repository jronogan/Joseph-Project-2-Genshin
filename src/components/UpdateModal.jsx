import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewObtainedChar,
  getAllArtifacts,
  getAllCharacters,
  getAllElements,
  getAllWeapons,
  updateChar,
} from "../api";

const Overlay = (props) => {
  const [updatedChar, setUpdatedChar] = useState({
    id: props.id,
    Name: props.name,
    Constellation: props.constellation,
    Weapon: props.weapon,
    Artifact: props.artifact,
    Element: props.element,
  });

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

    if (!updatedChar.Name) {
      alert("Please select a character");
      return;
    }
    console.log(updatedChar);
    updateCharMutate.mutate(updatedChar);
  };

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
          <h2>Update Character</h2>
          <div className="form-group">
            <label>Name</label>
            {/* SELECT NAME OPTIONS */}
            <select
              name="Name"
              value={updatedChar.Name}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Name}>{updatedChar.Name}</option>
              {queryAllChars.isSuccess &&
                queryAllChars.data.map((char) => (
                  <option key={char} value={char}>
                    {char}
                  </option>
                ))}
            </select>
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
              <option value={updatedChar.Weapon}>{updatedChar.Weapon}</option>
              {queryAllWeapons.isSuccess &&
                queryAllWeapons.data.map((weapon) => (
                  <option key={weapon} value={weapon}>
                    {weapon}
                  </option>
                ))}
            </select>
            <label>Artifact</label>
            {/* SELECT ARTIFACT OPTIONS */}
            <select
              name="Artifact"
              value={updatedChar.Artifact}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Artifact}>
                {updatedChar.Artifact}
              </option>
              {queryAllArtifacts.isSuccess &&
                queryAllArtifacts.data.map((artifact) => (
                  <option key={artifact} value={artifact}>
                    {artifact}
                  </option>
                ))}
            </select>

            <label>Element</label>
            <select
              name="Element"
              value={updatedChar.Element}
              onChange={handleChange}
              className="form-control"
            >
              <option value={updatedChar.Element}>{updatedChar.Element}</option>
              {queryAllElements.isSuccess &&
                queryAllElements.data.map((element) => (
                  <option key={element} value={element}>
                    {element}
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
