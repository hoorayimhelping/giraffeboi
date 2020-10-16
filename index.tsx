import React from 'react'
import ReactDOM from 'react-dom'

import {Plot, newTable} from '@influxdata/giraffe'

const PlotRenderer = ({config}) => {
  return (
    <div
      style={{
        width: "calc(70vw - 20px)",
        height: "calc(70vh - 20px)",
        margin: "40px",
      }}
    >
      <Plot config={config} />
    </div>
  );
};

const table = newTable(3)
  .addColumn('_time', 'dateTime:RFC3339', 'time', [1589838401244, 1589838461244, 1589838521244])
  .addColumn('_value', 'double', 'number', [2.58, 7.11, 4.79]);

const lineLayer = {
  type: "line",
  x: "_time",
  y: "_value"
};

const config = {
  table: table,
  layers: [lineLayer]
};

ReactDOM.render(
  (<PlotRenderer config={config} />),
  document.getElementById('root')
);
