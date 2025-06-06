import React, { Component } from 'react';
import MapDisplay from "./map/map"
import axios from 'axios';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    users: [],
    loading: true,
  };

  componentDidMount() {
    this.getUser();
  }
  async getUser() {
    try {
      let users = await axios.get(config.endPoint.getUser);
      this.setState({ users: users.data, loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  }

  render() {
    if (this.state.loading) {
      return (<div>Loading...</div>);
    } else {
      return (
        <div className="App">
          <div className="App-header">
            <h1>City_Hive Map Markers</h1>
          </div>
          <MapDisplay users={this.state.users}></MapDisplay>
        </div>
      );
    }
  }
}

export default App;
