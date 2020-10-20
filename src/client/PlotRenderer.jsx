import React from 'react'
import ReactDOM from 'react-dom'

import {Plot, newTable, fromFlux} from '@influxdata/giraffe'

const style = {
  width: "calc(70vw - 20px)",
  height: "calc(70vh - 20px)",
  margin: "40px",
};

export class PlotRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.animationFrameId;

    this.state = {
      layer: {
        type: 'line',
        x: '_time',
        y: '_value'
      },
      table: {},
      timestamps: [],
      values: [],
    };

    this.animateFakeData = this.animateFakeData.bind(this);
    this.animateRealData = this.animateRealData.bind(this);
    this.createFakeDataTable = this.createFakeDataTable.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async componentDidMount() {
    try {
      const resp = await this.fetchData();
      const resultsCSV = await resp.text();
      let results;

      try {
        results = fromFlux(resultsCSV);
      } catch (error) {
        console.error('error', error.message)
      }

      this.setState({
        table: results.table
      })
      // this.animationFrameId = window.setInterval(this.animateRealData, 1000);
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
      layers: [this.state.layer]
    };

    if (!Object.keys(config.table).length) {
      return null
    }

    return (
      <div style={style}>
        <Plot config={config} />
      </div>
    );
  }

  fetchData() {
    return fetch('http://localhost:8617/query', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  animateRealData() {

  }

  animateFakeData() {
    const lastTimestamp = [...this.state.timestamps].pop();
    const nextTimestamp = lastTimestamp + 6000;

    const timestamps = [...this.state.timestamps, nextTimestamp];
    const values = [...this.state.values, window.parseFloat(Math.random() * (10 - 1) + 1)];

    if (timestamps.length > 50) {
      console.log('removing older data');
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
          .addColumn('_time', 'dateTime:RFC3339', 'time', this.state.timestamps)
          .addColumn('_value', 'double', 'number', this.state.values)
  }

  createRealDataTable() {

  }
}
