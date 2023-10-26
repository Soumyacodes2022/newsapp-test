import React from "react";
import loading from "../loading.gif";

const spinner = () => {
  return (
    <div>
      <div className="text-center">
        <img src={loading} style={{ height: "90px" }} alt="loading"></img>
      </div>
    </div>
  );
};

export default spinner;
