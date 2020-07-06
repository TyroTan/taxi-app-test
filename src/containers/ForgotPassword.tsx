import React, { useRef, useState, useGlobal } from 'reactn';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageStyle,
  StatusBar,
  TextInput,
  TextStyle,
  Alert,
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
  Keyboard,
  ActivityIndicator,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import forgotPasswordBG from '../assets/images/forgot-passwod-bg.png';
import loginAdminTitleBG from '../assets/images/login-admin-title-bg.png';
import iconEmailImg from '../assets/images/icon-email.png';
import iconPasswordImg from '../assets/images/icon-password.png';
import {
  getStatusBarHeight,
  primaryPalette,
  isIphoneScreenWidthSmall,
  getCaughtAxiosErrorObj,
  emailValidator,
} from '../utils';
import { scale } from 'react-native-size-matters';
import { HEIGHT_WINDOW, ERROR_500_MSG } from '../utils/constants';
import { TextInputIconXL } from '../commons/components';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { INavigation } from '../..';
import { forgotPasswordPOST } from '../services/backend';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface LoginAdminStyle {
  wrapper: ViewStyle;
  bgImage: ImageStyle;
  signInSection1: ViewStyle;
  signInSection1h3: TextStyle;
  iconArrowWrapper: ViewStyle;
  iconArrow: ViewStyle;
  inputWrapperStyle: ViewStyle;
  inputPasswordWrapperStyle: ViewStyle;
  loginBG: ViewStyle;
  titleBGImage: ImageStyle;
  iconEmailIMG: ImageStyle;
  iconPasswordIMG: ImageStyle;

  footerWrapper: ViewStyle;
  footerText: TextStyle;
  footerArrow: ImageStyle;

  forgotText: TextStyle;
}

const styles = StyleSheet.create<LoginAdminStyle>({
  wrapper: {
    height: '100%',
    backgroundColor: primaryPalette.blue,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bgImage: {
    // marginTop: getStatusBarHeight(),
    height: isIphoneScreenWidthSmall() ? HEIGHT_WINDOW * 0.25 : scale(395),
    // height: scale(395),

    width: '100%',
    backgroundColor: primaryPalette.blue,
  },
  signInSection1: {
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: scale(37),
    borderTopLeftRadius: scale(37),
    backgroundColor: '#FFF',
    height: HEIGHT_WINDOW * 0.515,
    width: '100%',
    padding: scale(25),
  },
  signInSection1h3: {
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(17),
    lineHeight: scale(19),
    fontWeight: '800',

    marginTop: scale(30),
    marginBottom: scale(10),
  },

  iconArrowWrapper: {
    // bottom: getStatusBarHeight(true) + scale(20),
    // right: scale(15),
    // position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: scale(10),

    elevation: 2,
    shadowColor: '#a0a0a0',
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,

    backgroundColor: primaryPalette.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(27),
    height: scale(55),
    width: scale(55),
  },
  iconArrow: {
    height: scale(30),
    width: scale(30),
  },

  inputWrapperStyle: {
    marginTop: scale(25),
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
    paddingBottom: scale(12),
  },

  inputPasswordWrapperStyle: {
    marginTop: scale(10),
  },

  loginBG: {
    marginTop: getStatusBarHeight(),
    height: '100%',
    // width: WIDTH_WINDOW
  },
  titleBGImage: {
    position: 'absolute',
    // top: getStatusBarHeight(true),
    left: '28%',
    width: '46%',
    // height: scale(55),
  },
  iconEmailIMG: {
    width: scale(19),
    height: scale(12),
  },
  iconPasswordIMG: {
    width: scale(16),
    height: scale(16),
  },
  footerWrapper: {
    flex: 1,
    marginBottom: scale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerText: {
    fontFamily: 'Avenir',
    fontSize: scale(17),
    lineHeight: scale(21),
    color: primaryPalette.dark,
    fontWeight: '800',
  },
  footerArrow: {
    marginLeft: scale(7),
    width: scale(15),
    height: scale(15),
    marginTop: scale(2),
  },
  forgotText: {
    fontFamily: 'Avenir',
    fontSize: scale(15),
    lineHeight: scale(20),
    color: primaryPalette.dark,
    fontWeight: '300',
  },
});

const IconComponentEmail = (): JSX.Element => (
  // <IconComponent name="email" size={scale(19)} />
  <Image
    style={styles.iconEmailIMG}
    resizeMode="stretch"
    source={iconEmailImg}
  />
);

const IconComponentXSign = (): JSX.Element => (
  // <IconComponent name="email" size={scale(19)} />
  <View
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      height: scale(20),
      width: scale(20),
      borderRadius: scale(10),
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      // alignSelf: 'center'
    }}>
    <IconFeather name="x" color={primaryPalette.light} size={scale(14)} />
  </View>
);

interface RoundButtonProps extends INavigation, Partial<TouchableOpacityProps> {
  spinning?: boolean;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  onPress,
  spinning,
}): JSX.Element => {
  // const [, setUserData] = useGlobal('currentUser');
  return (
    <TouchableOpacity style={styles.iconArrowWrapper} onPress={onPress}>
      {spinning ? (
        <ActivityIndicator color={primaryPalette.light} />
      ) : (
        <IconAnt
          name="arrowright"
          size={scale(30)}
          color="#FFF"
          style={styles.iconArrow}
        />
      )}
    </TouchableOpacity>
  );
};

const RenderSection1: React.FC<INavigation> = (props): JSX.Element => {
  const keyboard = useKeyboard();
  const [, setUserData] = useGlobal('currentUser');
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [, setIsPasswordValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const refUsername = useRef(null);
  const refPassword = useRef(null);

  const asyncClear = async (): Promise<void> => {
    await setIsEmailValid(true);
    await setIsPasswordValid(true);
  };

  const asyncValidateAll = async (): Promise<boolean> => {
    await asyncClear();
    const hasNoEmailError = emailValidator(username);

    if (!hasNoEmailError) {
      await setIsEmailValid(false);
    }

    return hasNoEmailError;
  };

  const onSubmit = async (): Promise<void> => {
    try {
      Keyboard.dismiss();
      if (loading) {
        return;
      }
      const hasNoEmailError = await asyncValidateAll();

      if (!hasNoEmailError) {
        return;
      }

      setLoading(true);

      const res = await forgotPasswordPOST({
        data: {
          email: username,
        },
      });
      if (res) {
        props.navigation.navigate('LoginAdmin', {
          state: {
            forgotPasswordMsg:
              res?.detail ?? 'Password reset e-mail has been sent.',
          },
        });
      }
    } catch (e) {
      console.log('forgotPasswordPOST e', e);
      console.log('forgotPasswordPOST e object', getCaughtAxiosErrorObj(e));
      const msg =
        getCaughtAxiosErrorObj(e)?.error ??
        getCaughtAxiosErrorObj(e)?.detail ??
        getCaughtAxiosErrorObj(e)?.email?.email?.[0] ??
        getCaughtAxiosErrorObj(e)?.email?.email ??
        ERROR_500_MSG;
      Alert.alert(msg);
    }

    setLoading(false);
  };

  // useEffect(() => {

  //   return () => {
  //   }
  // }, []);

  return (
    <View
      style={[
        styles.signInSection1,
        keyboard.isKeyboardShow ? { height: HEIGHT_WINDOW * 0.8 } : {},
      ]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flex: 1,
        }}>
        <Text style={styles.signInSection1h3}>Forgot Password</Text>
        <Text style={styles.forgotText}>
          Please enter your registered email ID. We will send a link to reset
          your password.
        </Text>
        {/* <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.body}> */}
        {/* <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{}}> */}
        <TextInputIconXL
          // isValid={true}
          rightElement={(): JSX.Element =>
            isEmailValid ? (
              ((null as unknown) as JSX.Element)
            ) : (
              <IconComponentXSign />
            )
          }
          wrapperStyle={styles.inputWrapperStyle}
          textInputProps={{
            ref: refUsername,
            style: {
              paddingVertical: scale(15),
              fontFamily: 'Avenir',
              color: primaryPalette.dark,
              fontSize: scale(16),
              lineHeight: scale(21),
              width: '85%',
              // paddingVertical: scale(3)
            },
            returnKeyType: 'next',
            // autoCompleteType: 'email',
            onSubmitEditing: (): void => {
              setTimeout(() => {
                if (refPassword.current) {
                  ((refPassword.current || {}) as TextInput).focus();
                }
              }, 120);
            },
            keyboardType: 'email-address',
            onChangeText: (text): void => {
              asyncClear();
              setUsername(text.toLowerCase());

              // if (isFormValid !== true) {
              //   setIsFormValid(true);
              //   setRightError('');
              //   setTimeout(() => {
              //     if (refUsername.current) {
              //       ((refUsername.current || {}) as TextInput).focus();
              //     }
              //   }, 60);
              // }
            },
            value: username,
          }}
          leftIcon={IconComponentEmail}
        />
        <View style={{ height: scale(20) }} />
        <RoundButton spinning={loading} onPress={onSubmit} {...props} />
      </ScrollView>
    </View>
  );
};

const ForgotPassword: React.FC<INavigation> = (props): JSX.Element => {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        resizeMode="contain"
        style={styles.loginBG}
        imageStyle={styles.bgImage}
        source={forgotPasswordBG}>
        <Image
          resizeMode="contain"
          style={styles.titleBGImage}
          source={loginAdminTitleBG}
        />
        <RenderSection1 {...props} />
      </ImageBackground>
    </View>
  );
};

export default ForgotPassword;
