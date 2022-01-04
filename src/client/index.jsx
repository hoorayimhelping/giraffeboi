import React from "react";
import ReactDOM from "react-dom";

import '@influxdata/clockface/dist/index.css'

import {AppWrapper, Page} from '@influxdata/clockface'

import { LineRenderer } from "./LineRenderer";
import { MapRenderer } from "./MapRenderer";

ReactDOM.render(
  <AppWrapper>
    <Page>
      <Page.Header fullWidth={true} />
      <Page.Contents fullWidth={true}>
        <LineRenderer />
      </Page.Contents>
    </Page>
  </AppWrapper>,
  document.getElementById("root")
);
