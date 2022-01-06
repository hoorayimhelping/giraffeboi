import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "@influxdata/clockface/dist/index.css";

import { AppWrapper } from "@influxdata/clockface";
import { MainPage } from "./components/MainPage";
import { Rides } from "./components/Rides";

import { appReducer } from "./reducers/app";
const store = createStore(appReducer);

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/rides/:rideName" element={<Rides />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  </Provider>,
  document.getElementById("root")
);
