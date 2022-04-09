import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarMenu from "./component/NavbarMenu";
import Hero from "./component/Hero";
import Create from "./component/pages/Create";
import Donate from "./component/pages/Donate";
import Campaign from "./component/Campaign";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <NavbarMenu />
        <Routes>
          <Route exact path="/" element={<Hero />} />
          <Route exact path="/create" element={<Create />} />
          <Route exact path="/donate" element={<Donate />} />
          <Route exact path="/latest-campaigns" element={<Hero />} />
          <Route exact path="/campaigns/:id" element={<Campaign />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
