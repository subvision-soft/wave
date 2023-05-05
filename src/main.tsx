import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);
import "@capacitor-community/camera-preview";
window.screen.orientation.lock("portrait");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
