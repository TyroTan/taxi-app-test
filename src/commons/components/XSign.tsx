import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, primaryPalette } from '../../utils';
import IconFeather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  xsign: {
    height: scale(22),
    width: scale(22),
    borderRadius: scale(11),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center'
  },
});

const XSign: React.FC = () => (
  <View style={styles.xsign}>
    <IconFeather name="x" color={primaryPalette.light} size={scale(12)} />
  </View>
);

export default XSign;
