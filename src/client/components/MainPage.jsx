import React from "react";
import {connect} from 'react-redux'
import {
  ComponentColor,
  Dropdown,
  IconFont,
  Page,
} from "@influxdata/clockface";

import {setSelectedPark} from '../actions/app'

class _MainPage extends React.Component {
  constructor(props) {
    super(props)

    this.handleParkClick = this.handleParkClick.bind(this)
  }

  handleParkClick(parkId) {
    this.props.setSelectedPark(parkId)
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
        <Page.Contents fullWidth={true}></Page.Contents>
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
  setSelectedPark
}

const connector = connect(mstp, mdtp)

export const MainPage = connector(_MainPage)
