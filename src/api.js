const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_URL = import.meta.env.VITE_AIRTABLE_BASE_URL;
export const EXT_BASE_URL = import.meta.env.VITE_EXT_BASE_URL;

export const getAllCharacters = async () => {
  const res = await fetch(EXT_BASE_URL + "characters");

  if (!res.ok) {
    throw new Error("Error obtaining all available characters");
  }

  return await res.json();
};

export const getAllWeapons = async () => {
  const res = await fetch(EXT_BASE_URL + "weapons");

  if (!res.ok) {
    throw new Error("Error obtaining all available weapons");
  }

  return await res.json();
};

export const getAllArtifacts = async () => {
  const res = await fetch(EXT_BASE_URL + "artifacts");

  if (!res.ok) {
    throw new Error("Error obtaining all available artifacts");
  }

  return await res.json();
};

export const getAllElements = async () => {
  const res = await fetch(EXT_BASE_URL + "elements");

  if (!res.ok) {
    throw new Error("Error obtaining all elements");
  }

  return await res.json();
};

export const getCharacterDetails = async (name) => {
  const res = await fetch(`${EXT_BASE_URL}characters/${name}`);

  if (!res.ok) {
    throw new Error("Error obtaining details of character");
  }

  return await res.json();
};

export const getWeaponDetails = async (name) => {
  const res = await fetch(`${EXT_BASE_URL}weapons/${name}`);

  if (!res.ok) {
    throw new Error("Error obtaining details of weapon");
  }

  return await res.json();
};

export const myObtainedCharacters = async () => {
  const res = await fetch(AIRTABLE_BASE_URL + "/tblWKr61RCEE40YMn", {
    method: "GET",
    headers: {
      // THIS IS NEEDED FOR AUTHENTICATION!
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error obtaining details of weapon");
  }

  const data = await res.json();
  //   This is necessary since the Airtable information is an object
  return data.records;
};

export const deleteChar = async (id) => {
  const res = await fetch(`${AIRTABLE_BASE_URL}/tblWKr61RCEE40YMn/${id}`, {
    method: "DELETE",
    headers: {
      // THIS IS NEEDED FOR AUTHENTICATION!
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error obtaining details of weapon");
  }

  const data = await res.json();
  //   This is necessary since the Airtable information is an object
  return data.records;
};

export const addNewObtainedChar = async ({
  Name,
  Constellation,
  Weapon,
  Artifact,
  Element,
}) => {
  const res = await fetch(`${AIRTABLE_BASE_URL}/tblWKr61RCEE40YMn`, {
    method: "POST",
    headers: {
      // THIS IS NEEDED FOR AUTHENTICATION!
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name,
            // Need to parseInt since the value is initially a string
            Constellation: parseInt(Constellation),
            Weapon,
            Artifact,
            Element,
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("Error posting new Character");
  }

  const data = await res.json();
  //   Double check if need to do data.records[0] --> 0 since only one fields item inside the array
  return data.records[0];
};

export const updateChar = async ({
  id,
  Name,
  Constellation,
  Weapon,
  Artifact,
  Element,
}) => {
  const res = await fetch(`${AIRTABLE_BASE_URL}/tblWKr61RCEE40YMn/${id}`, {
    method: "PATCH",
    headers: {
      // THIS IS NEEDED FOR AUTHENTICATION!
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Name,
        // Need to parseInt since the value is initially a string
        Constellation: parseInt(Constellation),
        Weapon,
        Artifact,
        Element,
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Error posting new Character");
  }

  const data = await res.json();
  //   Double check if need to do data.records[0] --> 0 since only one fields item inside the array
  return data.fields;
};
