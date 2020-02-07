import * as React from "react";
import { IS_PRODUCTION, HELLO_TEXT } from "./config";

const textStyle = { fontSize: 20, margin: 4 };
export default () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <div style={textStyle}>{"Is production: " + IS_PRODUCTION}</div>
    <div style={textStyle}>{"Hello " + HELLO_TEXT + " !"}</div>
  </div>
);
