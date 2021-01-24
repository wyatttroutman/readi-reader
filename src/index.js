import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
