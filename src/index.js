import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);

// Register service worker for PWA behavior (works after a production build)
serviceWorkerRegistration.register();

