import React from "react";
import ReactDOM from "react-dom";

import { LineRenderer } from "./LineRenderer";
import { MapRenderer } from "./MapRenderer";

ReactDOM.render(
  <>
    <LineRenderer />
    <MapRenderer />
  </>,
  document.getElementById("root")
);
