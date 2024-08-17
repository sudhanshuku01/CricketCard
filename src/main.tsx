import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GameoverProvider } from "./context/GameContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <GameoverProvider>
          <App />
        </GameoverProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
