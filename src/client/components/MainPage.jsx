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
    this.state = {
      parks: []
    }

    this.handleParkClick = this.handleParkClick.bind(this)
  }

  handleParkClick(parkName) {
    this.props.setSelectedPark(parkName)
  }

  componentDidMount() {
    this.setState({
      parks: ['DisneyLand', 'Universal Studios', 'Sea World']
    })
  }

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
                  {this.state.parks.map(parkName => (
                    <Dropdown.Item
                      key={parkName}
                      value={parkName}
                      id={parkName}
                      onClick={this.handleParkClick}
                      selected={this.props.selectedPark === parkName}
                    >
                      {parkName}
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
                  {this.props.selectedPark ? this.props.selectedPark : 'Theme Parks'}
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
  console.log('mstp', appState)
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
