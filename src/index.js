import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import 'antd/dist/antd.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Admin from "./Admin";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
