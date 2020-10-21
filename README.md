# giraffeboi

A small app that uses InfluxData's [giraffe](https://github.com/influxdata/giraffe/tree/master/giraffe) library to render a simple plot of Influxdb data.

The app has a small express server to act as a proxy to an influxdb instance. The client is written in React and JavaScript and uses Fetch to talk to the server.

`src/server` and `src/client` are the code locations for the server and client.

### Starting the Server

```sh
INFLUX_URL=http://localhost:9999 INFLUX_TOKEN=foo node src/server/main.js
```

(fill in your proper [`INFLUX_URL`](https://docs.influxdata.com/influxdb/v2.0/reference/urls/) and [`INFLUX_TOKEN`](https://docs.influxdata.com/influxdb/v2.0/security/tokens/create-token/) values). 

### Starting the UI
```sh
yarn client-build
```

After building, go to http://localhost:8617

You can also build the UI in watch mode

```sh
yarn client-dev
```
