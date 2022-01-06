import React from "react";
import {connect} from 'react-redux'
import {
  ComponentColor,
  Dropdown,
  IconFont,
  Page,
} from "@influxdata/clockface";

import {setSelectedPark, setSelectedParkRides} from '../actions/app'
import {ParksTable} from './ParksTable'

class _MainPage extends React.Component {
  constructor(props) {
    super(props)

    this.handleParkClick = this.handleParkClick.bind(this)
    this.fetchParkRides = this.fetchParkRides.bind(this)
  }

  handleParkClick(parkId) {
    this.props.setSelectedPark(parkId)
    this.fetchParkRides(parkId)
  }

  async fetchParkRides(parkId) {
    const resp = await fetch(
      `http://localhost:8617/parks/${parkId}/rides/Open`,
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

      this.props.setSelectedParkRides(rides)
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {}

  render() {
    return (
      <Page>
        <Page.Header fullWidth={true}>
          <Page.Title title="Park Rides" />
        </Page.Header>
        <Page.ControlBar fullWidth={false}>
          <Page.ControlBarLeft>
            <Dropdown
              menu={onCollapse => (
                <Dropdown.Menu onCollapse={onCollapse}>
                  {this.props.parks.map(park => (
                    <Dropdown.Item
                      key={park.name}
                      value={park.id}
                      id={park.id}
                      onClick={this.handleParkClick}
                      selected={this.props.selectedPark === park.id}
                    >
                      {park.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              )}
              button={(active, onClick) => (
                <Dropdown.Button
                  active={active}
                  onClick={onClick}
                  icon={IconFont.Plus_New}
                  color={ComponentColor.Primary}
                >
                  {this.props.selectedPark ? this.props.parks.find(park => park.id === this.props.selectedPark).name : 'Theme Parks'}
                </Dropdown.Button>
              )}
            />
          </Page.ControlBarLeft>
        </Page.ControlBar>
        <Page.Contents fullWidth={true} scrollable={true}>
          {
            this.props.selectedPark ?
              <ParksTable /> :
              <h2>Please Select A Park</h2>
          }
        </Page.Contents>
      </Page>
    );
  }
}

const mstp = (appState) => {
  return {
    parks: appState.parks,
    selectedPark: appState.selectedPark,
  }
}

const mdtp = {
  setSelectedPark,
  setSelectedParkRides
}

const connector = connect(mstp, mdtp)

export const MainPage = connector(_MainPage)
