import React from "react";
import "./styles/globals.css";
import App from "./App";
import {RecoilRoot} from "recoil";
import {createRoot} from "react-dom/client";

const container = document.getElementById("root") as Element;
const root = createRoot(container);

root.render(
// @ts-ignore
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
