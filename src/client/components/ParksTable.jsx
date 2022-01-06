import React from "react";
import { connect } from "react-redux";

import { Table } from "@influxdata/clockface";

// const config = {
//   fluxResponse: null,
//   layers: [
//     {
//       type: "table",
//       properties: {
//         colors: DEFAULT_TABLE_COLORS,
//         decimalPlaces: {
//           digits: 3,
//           isEnforced: true,
//         },
//         tableOptions: {
//           fixFirstColumn: false,
//           verticalTimeAxis: true,
//         },
//         fieldOptions: [
//           // { displayName: "_value", internalName: "_value", visible: true },
//           // { displayName: "_field", internalName: "_field", visible: true },
//           // { displayName: "_measurement", internalName: "_measurement", visible: true },
//           { displayName: "Ride Name", internalName: "name", visible: true },
//           // { displayName: "result", internalName: "result", visible: true },
//           // { displayName: "table", internalName: "table", visible: true },
//         ],
//         timeFormat: "YYYY-MM-DD HH:mm:ss ZZ",
//       },
//       timeZone: "local",
//       tableTheme: 'dark'
//     },
//   ],
// };

const config = {
  fluxResponse: null,
  layers: [
    {
      type: "simple table",
      showAll: false,
    },
  ],
};

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

    console.log("rides", this.state.rides);
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
                <Table.Cell>{ride}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    );

    console.log("table", this.state.results, this.state.table);
    config.fluxResponse = this.state.results;

    return (
      <div
        style={{
          width: "calc(70vw - 20px)",
          height: "calc(70vh - 20px)",
          margin: "40px",
        }}
      >
        <Plot config={config} />
      </div>
    );

    // return this.props.parks.find(park => park.id === this.props.selectedPark).name
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
