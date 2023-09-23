import React from "react";
import "./App.css";
import PizzaMenu from "./components/PizzaMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const App = () => {
  return (
    <>
      <h1 className="menu-title">Pizza</h1>
      <PizzaMenu />
    </>
  );
};

export default App;
