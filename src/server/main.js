#!/usr/bin/env node
import express from 'express'

import {query} from './routes.js'
import {Requester} from './requests.js'

const app = express();
const port = 8617;

const requester = new Requester(
  process.env.INFLUX_URL || 'http://localhost:9999',
  process.env.INFLUX_TOKEN || 'token',
  process.env.INFLUX_ORG || 'my-org',
  process.env.DEFAULT_BUCKET || 'defbuck'
);

app.get('/query', () => {
  console.log('query route');
  query();
})

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});
