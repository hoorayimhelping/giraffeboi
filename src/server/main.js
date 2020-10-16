#!/usr/bin/env node
import express from 'express'

import {query} from './routes.js'

const app = express();
const port = 8617

app.get('/query', () => {
  console.log('query route');
  query();
})

app.listen(port, () => {
  console.log(`listening on port :${port}`);
});
