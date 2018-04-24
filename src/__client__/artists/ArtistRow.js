import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const ArtistRow = ({ artist: { artistImageUrl, name }, children }) => {
  return (
    <View style={styles.row}>
      <Image style={styles.picture} source={{ uri: artistImageUrl }} />
      <Text style={styles.primaryText}>{name}</Text>
      {children}
    </View>
  );
};

ArtistRow.propTypes = {
  artist: PropTypes.object.isRequired
};

export default ArtistRow;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  picture: { width: 50, height: 50, borderRadius: 25, marginRight: 18 },
  primaryText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    marginBottom: 4
  }
});
