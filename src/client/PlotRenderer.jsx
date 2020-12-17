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

    this.getTileServerUrl = this.getTileServerUrl.bind(this);
    this.fetchInfluxData = this.fetchInfluxData.bind(this);
    // this.getMap = this.getMap.bind(this);
  }

  async componentDidMount() {
    try {
      this.fetchInfluxData();
      await this.getTileServerUrl();
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

  async fetchInfluxData() {
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

  // fetchMapData(tileServerUrl) {
  //   return fetch(tileServerUrl, {
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   });
  // }

  // async getMap() {
  //   console.log("I am in getMap");
  //   const resp = await this.fetchMapData(
  //     this.state.layer.tileServerConfiguration.tileServerUrl
  //   );
  //   const res = resp.data;
  //   console.log("response: ", resp);
  //   console.log("This is response", res);
  // }

  fetchTileServerUrl() {
    return fetch("http://localhost:8617/tileServerUrl", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  async getTileServerUrl() {
    const resp = await this.fetchTileServerUrl();
    const res = await resp.json();
    console.log("This is response", res);
    const { url } = res;
    const tileServerConfiguration = {
      tileServerUrl: url,
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
}
