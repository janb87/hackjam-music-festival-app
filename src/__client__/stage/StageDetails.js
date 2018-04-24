import React, { Component } from 'react';
import { SectionList, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import { serverUrl } from '../config/server';
import ArtistRow from '../artists/ArtistRow';

// TODO display Stage details
// stageDetails is a concatenation of stage information: schedules and artists

class StageDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stageId: props.match.params.id,
      stageDetails: [],
      stage: null,
      errorMessage: null
    };
  }

  async componentDidMount() {
    const { stageId } = this.state;
    try {
      const [stageDetailsRequest, artistsRequest] = await Promise.all([
        axios.get(`${serverUrl}/stages/${encodeURIComponent(stageId)}`),
        axios.get(`${serverUrl}/artists`)
      ]);
      this.setState({
        stage: stageDetailsRequest.data
      });

      const scheduleRequest = await axios.get(
        `${serverUrl}/schedules/${encodeURIComponent(
          stageDetailsRequest.data.scheduleId
        )}`
      );

      const details = scheduleRequest.data.program.map(
        ({ start, end, artistId }) => ({
          artist: artistsRequest.data.find(artist => artist.id === artistId),
          start: new Date(start),
          end: new Date(end)
        })
      );
      this.setState({
        stageDetails: details
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message
      });
    }
  }

  renderItem = ({ item: { artist, start, end } }) => {
    return (
      <ArtistRow artist={artist} key={artist.id}>
        {this.renderSeparator()}
        <Text style={{ color: 'grey' }}>{`${moment(start).format(
          'HH:mm'
        )} - ${moment(end).format('HH:mm')}`}</Text>
      </ArtistRow>
    );
  };

  renderSeparator = () => (
    <View style={{ height: 1, backgroundColor: 'grey', marginLeft: 80 }} />
  );

  renderHeader = ({ name, date = new Date() }) => (
    <View
      style={{
        height: 30,
        backgroundColor: '#5E5EB4',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ color: 'white' }}>
        {name} - {moment(date).format('L')}
      </Text>
    </View>
  );

  render() {
    const { stage, stageDetails } = this.state;

    return (
      <View>
        <FlatList
          data={stageDetails}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={() =>
            this.renderHeader({
              name: stage && stage.name,
              date: stageDetails[0] && new Date(stageDetails[0].start)
            })
          }
        />
      </View>
    );
  }
}

StageDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default StageDetails;
