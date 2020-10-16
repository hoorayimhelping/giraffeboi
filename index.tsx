import React from 'react'
import ReactDOM from 'react-dom'

import {Plot, newTable} from '@influxdata/giraffe'

const style = {
  width: "calc(70vw - 20px)",
  height: "calc(70vh - 20px)",
  margin: "40px",
};

class PlotRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.animationFrameId;

    this.state = {
      timestamps: [],
      values: [],
      layer: {
        type: 'line',
        x: '_time',
        y: '_value'
      },
    };

    this.animate = this.animate.bind(this)
  }

  animate() {
    const lastTimestamp = [...this.state.timestamps].pop()
    const nextTimestamp = lastTimestamp + 6000

    const timestamps = [...this.state.timestamps, nextTimestamp]
    const values = [...this.state.values, window.parseFloat(Math.random() * (10 - 1) + 1)]

    if (timestamps.length > 50) {
      console.log('removing older data')
      timestamps.shift()
      values.shift()
    }


    this.setState({
      timestamps,
      values,
    })
  }

  componentDidMount() {
    this.setState({
      timestamps: [1589838401244, 1589838407244, 1589838413244],
      values: [5.56, 7.11, 6.5]
    })

    this.animationFrameId = window.setInterval(this.animate, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.animationFrameId)
  }

  render() {
    const config = {
      table: newTable(this.state.timestamps.length)
          .addColumn('_time', 'dateTime:RFC3339', 'time', this.state.timestamps)
          .addColumn('_value', 'double', 'number', this.state.values),
      layers: [this.state.layer]
    };

    return (
      <div style={style}>
        <Plot config={config} />
      </div>
    );
  }
}

// 1589838401244,
// 1589838461244,
// 1589838521244,
// 1589838581244,
// 1589838621244,

// const table = newTable(3)
//   .addColumn('_time', 'dateTime:RFC3339', 'time', [1589838401244, 1589838461244, 1589838521244])
//   .addColumn('_value', 'double', 'number', [2.58, 7.11, 4.79]);

// const lineLayer = ;

// const config = {
//   table: table,
//   layers: [lineLayer]
// };

ReactDOM.render(
  (<PlotRenderer />),
  document.getElementById('root')
);
