import React from "react";
import Navbar from "../components/Navbar/Navbar";
import AiringSeries from "../components/AiringSeries/airingSeries";
import "../assets/main.css";

function Index() {
  return (
    <>
      <Navbar></Navbar>
      <div id="content">
        <AiringSeries></AiringSeries>
      </div>
    </>
  );
}

export default Index;
