import React, {useEffect} from "react";
import {connect} from 'react-redux'
import {useParams} from "react-router-dom"

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
      results: '',
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

    const results = fromFlux(resultsCSV);

    this.setState({
      table: results.table,
      summary
    })
  }

  render() {
    if (!this.state.summary.length) {
      return null
    }

    config.table = this.state.table

    return (
      <Page>
        <Page.Header fullWidth={true}>
          <Page.Title title="Park Rides" />
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
                    <Table.Cell>{hour.time}</Table.Cell>
                    <Table.Cell>{hour.max}</Table.Cell>
                    <Table.Cell>{hour.avg}</Table.Cell>
                    <Table.Cell>{hour.min}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <div style={{
            width: "calc(70vw - 20px)",
            height: "calc(70vh - 20px)",
            margin: "10px",
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
