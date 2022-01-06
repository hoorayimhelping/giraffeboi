import React from "react";
import { connect } from "react-redux";

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
  return {
    parks: appState.parks,
    selectedPark: appState.selectedPark,
    selectParkRides: appState.selectedParkRides
  };
};

const connector = connect(mstp);

export const ParksTable = connector(_ParksTable);
