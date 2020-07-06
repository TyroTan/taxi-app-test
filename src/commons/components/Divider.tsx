import React from 'react';
import { View, ViewStyle, TextStyle, StyleSheet } from 'react-native';

import { scale } from '../../utils';

const styles = StyleSheet.create({
  divider: { flex: 1 },
  dividerLine: {
    flex: 1,
  },
});

const Divider: React.FC<{
  size: number;
  wrapperStyle?: ViewStyle;
}> = ({ size = 0, wrapperStyle = {} }) => {
  return (
    <View style={[styles.divider, { height: scale(size) }, wrapperStyle]} />
  );
};

const DividerLine: React.FC<{
  size: number;
  borderSize?: number;
  borderColor?: TextStyle['borderColor'];
  wrapperStyle?: ViewStyle;
}> = ({ size = 0, wrapperStyle = {}, borderSize = 1, borderColor }) => {
  return (
    <View
      style={[
        styles.dividerLine,
        {
          borderBottomWidth: scale(borderSize ?? 1),
          borderColor: borderColor ?? 'rgba(40,40,40, 0.2)',
          height: scale(size),
        },
        wrapperStyle,
      ]}
    />
  );
};

export { DividerLine };
export default Divider;
