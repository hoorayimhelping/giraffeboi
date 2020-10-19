#!/usr/bin/env node
import express from 'express'

import axios from 'axios'

const requester = axios.create({
  baseURL: process.env.INFLUX_URL,
  headers: {
    'Authorization': `Token ${process.env.INFLUX_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

const app = express();
const port = 8617;

app.get('/query', (req, res) => {
  const orgID = '275ac1e8a61d71f2';
  const bucket = 'telegraf';
  console.log('query route');

  const query = `
  from(bucket: "telegraf")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "mem")
    |> filter(fn: (r) => r._field == "used_percent")
    |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  `.trim();

  requester.request({
    method: 'post',
    url: 'api/v2/query',
    params: {
      orgID
    },
    data: {
      query,
      extern: {"type":"File","package":null,"imports":null,"body":[{"type":"OptionStatement","assignment":{"type":"VariableAssignment","id":{"type":"Identifier","name":"v"},"init":{"type":"ObjectExpression","properties":[{"type":"Property","key":{"type":"Identifier","name":"bucket"},"value":{"type":"StringLiteral","value":"telegraf"}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStart"},"value":{"type":"UnaryExpression","operator":"-","argument":{"type":"DurationLiteral","values":[{"magnitude":1,"unit":"h"}]}}},{"type":"Property","key":{"type":"Identifier","name":"timeRangeStop"},"value":{"type":"CallExpression","callee":{"type":"Identifier","name":"now"}}},{"type":"Property","key":{"type":"Identifier","name":"windowPeriod"},"value":{"type":"DurationLiteral","values":[{"magnitude":10000,"unit":"ms"}]}}]}}}]},
      dialect :{"annotations":["group","datatype","default"]}
    }
  }).then((response) => {
    console.log('ok', response)
    res.sendStatus(200)
  }).catch(error => {
    console.error(error)
    res.send(error)
  });

})

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});
