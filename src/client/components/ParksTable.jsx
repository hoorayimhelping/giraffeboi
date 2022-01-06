import React from "react";
import { connect } from "react-redux";

import { Table } from "@influxdata/clockface";

class _ParksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
    };
  }

  async componentDidMount() {
    const resp = await fetch(
      `http://localhost:8617/parks/${this.props.selectedPark}/rides/Open`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    const resultsCSV = await resp.text();

    try {
      const results = resultsCSV.split("\r\n");

      const rides = results
        .map((result) => result.split(",").pop())
        .filter((ride) => ride.trim() !== "" && ride !== "name");

      this.setState({
        rides,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.props.selectedPark) {
      return null;
    }

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ride</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.rides.map((ride) => {
            return (
              <Table.Row>
                <Table.Cell><a href={``}>{ride}</a></Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    );
  }
}

const mstp = (appState) => {
  console.log("selected park", appState.selectedPark);
  return {
    parks: appState.parks,
    selectedPark: appState.selectedPark,
  };
};

const connector = connect(mstp);

export const ParksTable = connector(_ParksTable);
