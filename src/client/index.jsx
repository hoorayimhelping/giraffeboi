import React from 'react'
import ReactDOM from 'react-dom'

import {PlotRenderer} from './PlotRenderer'

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
