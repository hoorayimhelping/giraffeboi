#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import request from "request-promise";

import axios from "axios";
import moment from "moment";

// import {
//   InfluxDB,
//   FluxTableMetaData,
//   flux,
//   fluxDuration,
// } from '@influxdata/influxdb-client'

const baseURL = process.env.INFLUX_URL; // url of your cloud instance (e.g. https://us-west-2-1.aws.cloud2.influxdata.com/)
const influxToken = process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
const orgID = process.env.ORG_ID; // export your org id;
const apiKey = process.env.API_KEY; //export your own apiKey;
const directMapboxUrl = process.env.DIRECT_URL;
const localMapEndpoint = process.env.MAP_ENDPOINT;

const influxProxy = axios.create({
  baseURL,
  headers: {
    Authorization: `Token ${influxToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const app = express();
const port = 8617;

app.get("/api/parks/:parkId/rides/:status", (req, res) => {
  const parkId = req.params.parkId;

  let status = "Open";
  if (req.params.status === "Closed") {
    status = "Closed";
  }

  influxProxy
    .request({
      method: "post",
      url: `api/v2/scripts/08b71e425ba60000/invoke`,
      data: {
        params: {
          parkid: parkId,
          status,
        },
      }
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.send(error.message);
    });
});

app.get("/api/parks/:parkId/ride/:rideName/summary", (req, res) => {
  const parkId = req.params.parkId;
  const rideName = req.params.rideName;

  influxProxy
    .request({
      method: "post",
      url: `api/v2/scripts/08b78f9fe2e60000/invoke`,
      data: {
        params: {
          parkid: parkId,
          ride: rideName,
        },
      }
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.send(error.message);
    });
});

app.get("/dist/bundle.js", (req, res) => {
  res.sendFile("bundle.js", { root: "./dist" });
});

app.get('*', (req, res) => {
  res.sendFile("index.html", { root: "./" });
});

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});
