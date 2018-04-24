import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import axios from 'axios';
import { serverUrl } from '../config/server';
import StageOverviewCard from './StageOverviewCard';

class Stages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stages: null,
      errorMessage: null
    };
  }

  async componentDidMount() {
    try {
      const request = await axios.get(`${serverUrl}/stages`);
      this.setState({
        stages: request.data
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message
      });
    }
  }

  render() {
    const { stages, errorMessage } = this.state;

    if (!stages) {
      return null;
    }

    if (errorMessage) {
      return <Text>{errorMessage}</Text>;
    }

    return stages.map(stage => (
      <StageOverviewCard key={stage.id} stage={stage} />
    ));
  }
}

export default Stages;
