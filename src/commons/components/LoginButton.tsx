import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

import iconGmailImg from '../../assets/images/icon-gmail.png';
import iconFBImg from '../../assets/images/icon-fb.png';
import iconEmailGreenImg from '../../assets/images/icon-email-green.png';
import rightArrowImg from '../../assets/images/right-arrow.png';
import { scale, primaryPalette } from '../../utils';
import { ImageSource } from 'react-native-vector-icons/Icon';

interface ButtonStyle {
  wrapper: ViewStyle;
  btnText: TextStyle;
}
const styles = StyleSheet.create<ButtonStyle>({
  wrapper: {
    borderRadius: scale(30),
    backgroundColor: primaryPalette.orange,
    height: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(25),
  },
  btnText: {
    marginLeft: scale(15),
    fontFamily: 'Avenir',
    fontSize: scale(19),
    lineHeight: scale(26),
    fontWeight: '500',
    color: primaryPalette.light,
    width: '80%',
  },
});

interface LoginButtonProps {
  type: 'email' | 'gmail' | 'fb';
  btnText: string;
  onPress?: () => void;
  imgSource: ImageSource;
  stylestext?: TextStyle;
  styleswrapper?: ViewStyle;
  stylesicon?: ImageStyle;
  rightIcon?: React.FC;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onPress,
  btnText,
  imgSource,
  styleswrapper = {},
  stylesicon = {},
  stylestext = {},
  rightIcon,
}) => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        onPress?.();
      }}
      style={[styles.wrapper, styleswrapper]}>
      <Image
        resizeMode="contain"
        source={imgSource}
        style={[{ width: scale(27), height: scale(22) }, stylesicon]}
      />
      <Text style={[styles.btnText, stylestext]}>
        {btnText ?? 'LoginButton'}
      </Text>
      <Image
        resizeMode="contain"
        source={rightIcon ?? rightArrowImg}
        style={{ width: scale(19), height: scale(19) }}
      />
    </TouchableOpacity>
  );
};

type SignupButtonProps = Pick<
  LoginButtonProps,
  'onPress' | 'styleswrapper' | 'stylesicon' | 'stylestext' | 'rightIcon'
>;

const GmailButton: React.FC<SignupButtonProps> = ({
  onPress,
  styleswrapper,
}) => {
  return (
    <LoginButton
      type="gmail"
      imgSource={iconGmailImg}
      onPress={onPress}
      btnText={'Sign up with gmail'}
      styleswrapper={styleswrapper}
    />
  );
};

const FbButton: React.FC<SignupButtonProps> = ({
  onPress,
  styleswrapper,
  stylesicon,
}) => {
  return (
    <LoginButton
      type="gmail"
      imgSource={iconFBImg}
      onPress={onPress}
      btnText={'Sign up with Facebook'}
      styleswrapper={styleswrapper}
      stylesicon={stylesicon}
    />
  );
};

const SignUpByEmailButton: React.FC<SignupButtonProps> = ({
  onPress,
  styleswrapper,
  stylestext,
  rightIcon,
}) => {
  return (
    <LoginButton
      type="email"
      imgSource={iconEmailGreenImg}
      onPress={onPress}
      btnText={'Sign up with email'}
      styleswrapper={styleswrapper}
      stylestext={stylestext}
      rightIcon={rightIcon}
    />
  );
};

export { GmailButton, FbButton, SignUpByEmailButton };
export default LoginButton;
