import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewObtainedChar,
  getAllArtifacts,
  getAllCharacters,
  getAllElements,
  getAllWeapons,
} from "../api";

const Overlay = (props) => {
  const [newChar, setNewChar] = useState({
    Name: "",
    Constellation: "",
    Weapon: "",
    Artifact: "",
    Element: "",
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
    setNewChar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewCharMutate = useMutation({
    mutationFn: (charData) => addNewObtainedChar(charData),
    onSuccess: () => {
      queryClient.invalidateQueries(["mychars"]);
      props.setAddingNew(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newChar.Name) {
      alert("Please select a character");
      return;
    }
    console.log(newChar);
    addNewCharMutate.mutate(newChar);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* DOUBLE CHECK THIS CLOSING */}
        <button onClick={() => props.setAddingNew(false)} className="close-btn">
          ×
        </button>
        <form onSubmit={handleSubmit}>
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
                    {char}
                  </option>
                ))}
            </select>
            <label>Constellation</label>
            {/* SELECT CONSTELLATION OPTIONS */}
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
                    {weapon}
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
                    {artifact}
                  </option>
                ))}
            </select>

            <label>Element</label>
            <select
              name="Element"
              value={newChar.Element}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select an element</option>
              {queryAllElements.isSuccess &&
                queryAllElements.data.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
            </select>
            <button type="submit">Add</button>
          </div>
        </form>
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
