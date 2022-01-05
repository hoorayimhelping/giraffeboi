import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import '@influxdata/clockface/dist/index.css'

import {AppWrapper} from '@influxdata/clockface'
import {MainPage} from './components/MainPage'
import {appReducer} from './reducers/app'

const store = createStore(appReducer)

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <MainPage />
    </AppWrapper>
  </Provider>,
  document.getElementById("root")
);
