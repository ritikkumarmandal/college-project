import React from "react";
import { useNavigate } from "react-router-dom";
import Register from './Register'
import  Login from './Login'
//import "./home.css";

function Home() {

  const navigate = useNavigate();

  return (
    <>
    <Register/>
    <Login/>
    </>
  );
}

export default Home;