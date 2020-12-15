#!/usr/bin/env node
import express from 'express'

import axios from 'axios'

const baseURL = process.env.INFLUX_URL; // url of your cloud instance (e.g. https://us-west-2-1.aws.cloud2.influxdata.com/)
const influxToken = process.env.INFLUX_TOKEN; // create an all access token in the UI, export it as INFLUX_TOKEN
const orgID = process.env.ORG_ID; // export your org id;

const influxProxy = axios.create({
  baseURL,
  headers: {
    'Authorization': `Token ${influxToken}`,
    'Content-Type': 'application/json'
  }
});

const app = express();
const port = 8617;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './' });
});

app.get('/dist/bundle.js', (req, res) => {
  res.sendFile('bundle.js', { root: './dist' });
})

app.get('/query', (req, res) => {

  const bucket = 'telegraf';

  const query = `
  from(bucket: "telegraf")
    |> range(start: -30s)
    |> filter(fn: (r) => r._measurement == "mem")
    |> filter(fn: (r) => r._field == "used_percent")
    |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  `.trim();

  influxProxy.request({
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
    res.send(response.data)
  }).catch(error => {
    res.send(error.message)
  });

})

app.get('/apiUrlKey', (req, res) => {
  res.send({ url: mapboxUrl, key: apiKey })
  })

app.get('/map', (req, res) => {

  const { x, y, z } = req.query

  console.log(req.query)

  // var mapboxClient = mapboxSdk({ accessToken: apiKey });

  // var request = mapboxClient.getStaticImage({
  //       ownerId: 'mapbox',
  //       styleId: 'ckhl79okh00o919npquotuqxp',
  //       width: 500,
  //       height: 350,
  //       position: {
  //         coordinates: [x, y],
  //         zoom: z
  //       },
  //     before_layer: 'road-label',
  //     });
  // var staticImageUrl = request.url();
  // console.log("staticimageurl: ", staticImageUrl)

  console.log('maboxUrls', mapboxUrl, x, y, z)
  const link = `https://api.mapbox.com/styles/v1/influxdata/ckhl79okh00o919npquotuqxp/tiles/256/${z}/${x}/${y}?access_token=${apiKey}`
  
  axios
    .get(link)
    .then((response) => {
      console.log(response.data)
      res.send(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});
