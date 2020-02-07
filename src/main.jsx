import "react-hot-loader";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { hot } from "react-hot-loader/root";
import ReactDOM from "@hot-loader/react-dom";
import * as React from "react";
import App from "./app";

function getAppContainer() {
  const currentContainer = window.document.getElementById("app");
  if (currentContainer !== null) {
    return currentContainer;
  }
  const newContainer = document.createElement("div");
  newContainer.setAttribute("id", "app");
  document.body.appendChild(newContainer);
  return newContainer;
}

const globalStyle = `
html, body, #app{
  height: 100%;
  width: 100%;
  margin: 0;
  display: flex;
}
#app > * {
  min-height: 100%;
  width: 100%;
}
`;

const Main = hot(() => (
  <>
    <App />
    <style dangerouslySetInnerHTML={{ __html: globalStyle }} />
  </>
));
ReactDOM.render(<Main />, getAppContainer());
