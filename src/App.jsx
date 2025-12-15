import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import AllCharacters from "./components/AllCharacters";
import AllWeapons from "./components/AllWeapons";
import MyCharacters from "./components/MyCharacters";
import CharacterDetails from "./components/CharacterDetails";
import WeaponDetails from "./components/WeaponDetails";
import "./styles.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/characters" element={<AllCharacters />} />
        <Route path="/weapons" element={<AllWeapons />} />
        <Route path="/myCharacters" element={<MyCharacters />} />
        <Route path="/characters/:name" element={<CharacterDetails />} />
        <Route path="/weapons/:name" element={<WeaponDetails />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
