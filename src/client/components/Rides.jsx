import React, {useEffect} from "react";
import {connect} from 'react-redux'
import {useParams, Link} from "react-router-dom"

import {Page, Table} from "@influxdata/clockface";
import {Plot, fromFlux} from "@influxdata/giraffe";

const config = {
  table: null,
  layers: [{
    type: "line",
    x: "_time",
    y: "_value",
  }],
};

class _Rides extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      table: null,
      summary: []
    }
  }
  async componentDidMount() {
    const resp = await fetch(
      `http://localhost:8617/api/parks/${this.props.selectedPark}/ride/${this.props.params.rideName}/summary`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    const resultsCSV = await resp.text();
    const cleanResults = resultsCSV.split("\r\n");
    cleanResults.shift()

    const summary = cleanResults.filter(r => r !== '')
      .map((row) => {
        const [_, __, ___, time, max, avg, min] = row.split(',')
        return {
          time, max, avg, min
        }
      })

    const graphResp = await fetch(
      `http://localhost:8617/api/parks/${this.props.selectedPark}/ride/${this.props.params.rideName}/graph`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    const graphResultsCSV = await graphResp.text();
    const results = fromFlux(graphResultsCSV);

    this.setState({
      table: results.table,
      summary
    })
  }

  render() {
    if (!this.state.summary.length) {
      return null
    }

    if (!this.state.table) {
      return null
    }

    config.table = this.state.table

    return (
      <Page>
        <Page.Header fullWidth={true}>
          <Link to="/"><Page.Title title="Park Ride Times" className="link" /></Link>
        </Page.Header>
        <Page.ControlBar fullWidth={false}>
          <Page.ControlBarLeft>
            <h3>{this.props.parks.find(park => park.id === this.props.selectedPark).name}</h3>
          </Page.ControlBarLeft>
          <Page.ControlBarRight>
            <h3>{this.props.params.rideName}</h3>
          </Page.ControlBarRight>
        </Page.ControlBar>
        <Page.Contents fullWidth={true} scrollable={true}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Max</Table.HeaderCell>
                <Table.HeaderCell>Avg</Table.HeaderCell>
                <Table.HeaderCell>Min</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.summary.map((hour) => {
                return (
                  <Table.Row key={hour.time}>
                    <Table.Cell>{new Date(hour.time).toLocaleString()}</Table.Cell>
                    <Table.Cell>{hour.max}</Table.Cell>
                    <Table.Cell>{parseInt(hour.avg, 10).toFixed(2)}</Table.Cell>
                    <Table.Cell>{hour.min}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <div style={{
            width: "100%",
            height: "calc(20vh - 20px)",
            margin: "auto",
          }}>
            <Plot config={config} />
          </div>
        </Page.Contents>
      </Page>
    )
  }
}

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

const mstp = (appState) => {
  return {
    parks: appState.parks,
    selectedPark: appState.selectedPark,
  }
}

const connector = connect(mstp)

export const Rides = connector(withParams(_Rides))
