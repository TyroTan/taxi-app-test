import React from 'react';
import {
  ActivityIndicator,
  Image,
  ViewStyle,
  TouchableOpacityProps,
  TouchableOpacity,
  StyleSheet,
  ImageStyle,
} from 'react-native';
import checkWhiteImg from '../../assets/images/check-white.png';
import { primaryPalette, scale } from '../../utils';
import { ImageSource } from 'react-native-vector-icons/Icon';

interface ButtonFloatingSubmitStyles {
  wrapperBtn: ViewStyle;
  checkSubmitImg: ImageStyle;
  btnShadow: ImageStyle;
  btnGreyed: ViewStyle;
}

const SIZE = 50;
const styles = StyleSheet.create<ButtonFloatingSubmitStyles>({
  wrapperBtn: {
    marginTop: scale(40),
    alignSelf: 'flex-end',
    height: scale(SIZE),
    width: scale(SIZE),
    borderRadius: scale(SIZE / 2),
    backgroundColor: primaryPalette.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnShadow: {
    elevation: 2,
    shadowColor: '#a0a0a0',
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  btnGreyed: {
    opacity: 0.75,
  },
  checkSubmitImg: {
    width: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface ButtonFloatingSubmitProps extends TouchableOpacityProps {
  shadowed?: boolean;
  spinning?: boolean;
  btnStyle?: ViewStyle;
  imgStyle?: ImageStyle;
  contentImgSource?: ImageSource;
  contentFC?: React.FC;
  size?: number;
}

const ButtonFloatingSubmit: React.FC<ButtonFloatingSubmitProps> = props => {
  const { btnStyle = {}, imgStyle = {} } = props;
  return (
    <TouchableOpacity style={[styles.wrapperBtn, btnStyle]} {...props}>
      {props.spinning === true ? (
        <ActivityIndicator color={primaryPalette.light} />
      ) : (
        <Image
          style={[styles.checkSubmitImg, imgStyle]}
          resizeMode="contain"
          source={checkWhiteImg}
        />
      )}
    </TouchableOpacity>
  );
};

const ButtonShadowed: React.FC<ButtonFloatingSubmitProps> = props => {
  const {
    btnStyle = {},
    imgStyle = {},
    shadowed = true,
    disabled = false,
    contentImgSource,
    contentFC,
    size = SIZE,
  } = props;
  const ContentImg: React.FC = () => {
    const ContentFC = contentFC
      ? (contentFC as React.FC)
      : (): JSX.Element => <></>;
    const img = contentImgSource ? contentImgSource : checkWhiteImg;
    return contentFC ? (
      <ContentFC />
    ) : (
      <Image
        style={[
          styles.checkSubmitImg,
          size === SIZE
            ? {}
            : {
                width: Math.round(scale((size * 2) / 5)),
                height: Math.round(scale((size * 2) / 5)),
              },
          imgStyle,
        ]}
        resizeMode="contain"
        source={img}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.wrapperBtn,
        shadowed ? styles.btnShadow : {},
        disabled ? styles.btnGreyed : {},
        size === SIZE
          ? {}
          : {
              width: size,
              height: size,
              borderRadius: scale(size / 2),
            },
        btnStyle,
      ]}
      {...props}>
      {props.spinning === true ? (
        <ActivityIndicator color={primaryPalette.light} />
      ) : (
        <ContentImg />
      )}
    </TouchableOpacity>
  );
};

export default ButtonFloatingSubmit;
export { ButtonShadowed };
