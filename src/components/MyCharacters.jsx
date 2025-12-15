import React, { useState } from "react";
import NavBar from "./NavBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChar, EXT_BASE_URL, myObtainedCharacters } from "../api";
import { Link, useParams } from "react-router-dom";
import AddModal from "./AddModal";
import UpdateModal from "./UpdateModal";

const MyCharacters = () => {
  const [addingNew, setAddingNew] = useState(false);
  const [updatingChar, setUpdatingChar] = useState(null);
  const queryClient = useQueryClient();
  const { name } = useParams();

  const queryMyChars = useQuery({
    queryKey: ["mychars"],
    queryFn: myObtainedCharacters,
  });

  const deleteCharMutate = useMutation({
    mutationFn: deleteChar,
    onSuccess: () => {
      queryClient.invalidateQueries(["mychars"]);
    },
  });

  return (
    <>
      {/* Portal for adding new Character */}
      {addingNew && <AddModal setAddingNew={setAddingNew} />}

      {/* Portal for updating Character */}
      {updatingChar && (
        <UpdateModal
          updatingChar={updatingChar}
          setUpdatingChar={setUpdatingChar}
          id={updatingChar.id}
          name={updatingChar.fields.Name}
          constellation={updatingChar.fields.Constellation}
          weapon={updatingChar.fields.Weapon}
          artifact={updatingChar.fields.Artifact}
          element={updatingChar.fields.Element}
        />
      )}

      <NavBar />
      <div className="container list-section">
        <h1>My Obtained Characters</h1>
        {/* BUTTON TO ADD NEW CHARACTERS --> OPEN PORTAL */}
        <button onClick={() => setAddingNew(true)} className="add-button">
          Add New Character
        </button>
        {/* List of My Obtained Characters */}
        {queryMyChars.isPending && <p>...Loading</p>}
        {queryMyChars.isError && <p>{queryMyChars.error.message}</p>}
        {queryMyChars.isSuccess && (
          <div className="my-char-list">
            {queryMyChars.data.map((char) => (
              <div key={char.id} className="char-card">
                <div className="char-card-content">
                  <div className="char-info">
                    <Link
                      to={`/characters/${char.fields.Name.toLowerCase()}`}
                    >{`${char.fields.Name} details`}</Link>
                    <h2>Name: {char.fields.Name}</h2>
                    <p>Constellation: {char.fields.Constellation}</p>
                    <p>Weapon: {char.fields.Weapon}</p>
                    <p>Artifact: {char.fields.Artifact}</p>
                    <p>Element: {char.fields.Element}</p>
                  </div>

                  <img
                    src={`${EXT_BASE_URL}characters/${char.fields.Name.toLowerCase()}/card`}
                    alt={`${char.fields.Name} card image`}
                    // style={{ maxWidth: "auto", height: "300px" }}
                    className="char-card-image"
                  />
                </div>

                <div className="char-actions">
                  <button
                    onClick={() => deleteCharMutate.mutate(char.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setUpdatingChar(char)}
                    className="update-button"
                  >
                    Update Character
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCharacters;
