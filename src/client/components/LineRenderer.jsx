import React from "react";

import {Page} from '@influxdata/clockface'
import {Plot, newTable, fromFlux} from "@influxdata/giraffe";

const style = {
  width: "calc(70vw - 20px)",
  height: "calc(70vh - 20px)",
  margin: "40px",
};

const REASONABLE_API_REFRESH_RATE = 30000;

export class LineRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.animationFrameId;

    this.state = {
      layer: {
        type: "line",
        x: "_time",
        y: "_value",
      },
      table: {},
      timestamps: [],
      values: [],
    };

    this.animateFakeData = this.animateFakeData.bind(this);
    this.animateRealData = this.animateRealData.bind(this);
    this.createFakeDataTable = this.createFakeDataTable.bind(this);
    this.createRealDataTable = this.createRealDataTable.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async componentDidMount() {
    try {
      this.createFakeDataTable()
      this.animationFrameId = window.setInterval(
        this.createFakeDataTable,
        REASONABLE_API_REFRESH_RATE
      );
      // this.createRealDataTable();
      // this.animationFrameId = window.setInterval(
      //   this.animateRealData,
      //   REASONABLE_API_REFRESH_RATE
      // );
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

    console.log(config)

    if (!Object.keys(config.table).length) {
      return (
        <h1>No Results</h1>
      )
    }

    return (
      <Page>
        <Page.Header fullWidth={true} />
        <Page.Contents fullWidth={true}>
          <div style={style}>
            <Plot config={config} />
          </div>
        </Page.Contents>
      </Page>
    );
  }

  fetchData() {
    return fetch("http://localhost:8617/linequery", {
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
    this.setState({table: newTable(this.state.timestamps.length)
      .addColumn("_time", "dateTime:RFC3339", "time", this.state.timestamps)
      .addColumn("_value", "double", "number", this.state.values)});
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
}
