import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Table } from "@influxdata/clockface";

class _ParksTable extends React.Component {
  constructor(props) {
    super(props);
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
          {this.props.selectParkRides.map((ride) => {
            return (
              <Table.Row key={ride}>
                <Table.Cell><Link to={`/rides/${ride}`}>{ride}</Link></Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    );
  }
}

const mstp = (appState) => {
  return {
    parks: appState.parks,
    selectedPark: appState.selectedPark,
    selectParkRides: appState.selectedParkRides
  };
};

const connector = connect(mstp);

export const ParksTable = connector(_ParksTable);
