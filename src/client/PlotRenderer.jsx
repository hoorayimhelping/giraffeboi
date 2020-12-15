import React from "react";
import ReactDOM from "react-dom";

import { Plot, newTable, fromFlux } from "@influxdata/giraffe";

const style = {
  width: "calc(70vw - 20px)",
  height: "calc(70vh - 20px)",
  margin: "40px",
};

const REASONABLE_API_REFRESH_RATE = 30000;

export class PlotRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.animationFrameId;

    this.state = {
      layer: {
        type: "geo",
        lat: 40,
        lon: -76,
        zoom: 6,
        allowPanAndZoom: true,
        detectCoordinateFields: false,
        layers: [
          {
            type: "pointMap",
            colorDimension: { label: "Duration" },
            colorField: "duration",
            colors: [
              { type: "min", hex: "#ff0000" },
              { value: 50, hex: "#343aeb" },
              { type: "max", hex: "#343aeb" },
            ],
            isClustered: false,
          },
        ],
        tileServerConfiguration: {
          tileServerUrl: "",
          bingKey: "",
        },
      },
      table: {},
      timestamps: [],
      values: [],
    };

    this.animateFakeData = this.animateFakeData.bind(this);
    this.animateRealData = this.animateRealData.bind(this);
    this.createFakeDataTable = this.createFakeDataTable.bind(this);
    this.createRealDataTable = this.createRealDataTable.bind(this);
    this.getMapUrlKey = this.getMapUrlKey.bind(this);
    this.getMap = this.getMap.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async componentDidMount() {
    try {
      this.createRealDataTable();
      await this.getMapUrlKey();
      this.getMap();
      this.animationFrameId = window.setInterval(
        this.animateRealData,
        REASONABLE_API_REFRESH_RATE
      );
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.animationFrameId);
  }

  render() {
    const config = {
      table: this.state.table,
      layers: [this.state.layer],
    };

    if (!Object.keys(config.table).length) {
      return null;
    }

    return (
      <div style={style}>
        <Plot config={config} />
      </div>
    );
  }

  fetchData() {
    return fetch("http://localhost:8617/query", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  animateRealData() {
    this.createRealDataTable();
  }

  animateFakeData() {
    const lastTimestamp = [...this.state.timestamps].pop();
    const nextTimestamp = lastTimestamp + 6000;

    const timestamps = [...this.state.timestamps, nextTimestamp];
    const values = [
      ...this.state.values,
      window.parseFloat(Math.random() * (10 - 1) + 1),
    ];

    if (timestamps.length > 50) {
      console.log("removing older data");
      timestamps.shift();
      values.shift();
    }

    this.setState({
      timestamps,
      values,
    });
  }

  createFakeDataTable() {
    return newTable(this.state.timestamps.length)
      .addColumn("_time", "dateTime:RFC3339", "time", this.state.timestamps)
      .addColumn("_value", "double", "number", this.state.values);
  }

  async createRealDataTable() {
    const resp = await this.fetchData();
    const resultsCSV = await resp.text();
    let results;

    try {
      results = fromFlux(resultsCSV);
    } catch (error) {
      console.error("error", error.message);
    }

    this.setState({
      table: results.table,
    });
  }

  fetchMapUrlKey() {
    return fetch("http://localhost:8617/apiUrlKey", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  async getMapUrlKey() {
    const resp = await this.fetchMapUrlKey();
    const res = await resp.json();
    console.log("This is response", res);
    const { url, key } = res;
    const tileServerConfiguration = {
      tileServerUrl: url + "?access_token=" + key,
      bingKey: "",
    };
    this.setState({
      layer: {
        ...this.state.layer,
        tileServerConfiguration: tileServerConfiguration,
      },
    });
    return resp;
  }

  fetchMapData() {
    return fetch("http://localhost:8617/map?z=1&x=40&y=76", {
      headers: {
        // "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  async getMap() {
    console.log("I am in createrealdatatable");
    const resp = await this.fetchMapData();
    const res = resp.data;
    console.log("response: ", resp);
    console.log("This is response", res);
  }
}
