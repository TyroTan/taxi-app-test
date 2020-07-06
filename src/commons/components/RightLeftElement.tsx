import React from 'react';
import { Image, StyleSheet, View, ViewStyle, ImageStyle } from 'react-native';
import { XSign } from '.';
import { scale } from '../../utils';
import checkGreenImg from '../../assets/images/check-green.png';

interface RightElementStyles {
  xsign: ViewStyle;
  iconDOBImg: ImageStyle;
  left: ViewStyle;
}

const styles = StyleSheet.create<RightElementStyles>({
  xsign: {
    width: '10%',
    alignItems: 'flex-end',
  },
  iconDOBImg: {
    width: scale(22),
    height: scale(22),
  },
  left: {
    width: '10%',
  },
});

const RightElementCheckSign = (): JSX.Element => (
  <View style={styles.xsign}>
    <Image
      style={styles.iconDOBImg}
      resizeMode="stretch"
      source={checkGreenImg}
    />
  </View>
);

const RightElementXSign: React.FC = () => {
  return (
    <View style={styles.xsign}>
      <XSign />
    </View>
  );
};

const LeftWrapper: React.FC = ({ children }) => {
  return <View style={styles.left}>{children}</View>;
};

export default RightElementXSign;
export { RightElementXSign, RightElementCheckSign, LeftWrapper };
