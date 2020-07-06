import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { scale } from '../../utils';

const sizeBase = 7,
  sizeUnit = 1.6; // , sizeUnitHalf = 0.8;

const sizeS = scale(sizeUnit * 3 + sizeBase);
const sizeM = scale(sizeUnit * 4 + sizeBase); // 13.4
const sizeL = scale(sizeUnit * 5 + sizeBase); // 15
const sizeXL = scale(sizeUnit * 7 + sizeBase); // 18.2
const sizeXXL = scale(sizeUnit * 9 + sizeBase); // 21.4
const sizeX3L = scale(sizeUnit * 11 + sizeBase);

interface BaseStyle {
  text: TextStyle;
}

interface CommonStyle {
  textSmall?: TextStyle;
  textMedium: TextStyle;
  button: ViewStyle;
}

const baseStyles = StyleSheet.create<BaseStyle>({
  text: {
    fontFamily: 'Avenir',
    letterSpacing: 0.5,
    color: '#000',
    fontSize: sizeS,
    lineHeight: sizeM,
    fontWeight: '700',
  },
});

const commonStyles = StyleSheet.create<CommonStyle>({
  textMedium: {
    ...baseStyles.text,
    fontSize: sizeL,
    lineHeight: sizeXL,
  },
  button: {
    borderWidth: 0,
    borderRadius: 30,
    width: scale(100),
    maxHeight: scale(36),
  },
});

export default commonStyles;
export { sizeS, sizeM, sizeL, sizeXL, sizeXXL, sizeX3L };
