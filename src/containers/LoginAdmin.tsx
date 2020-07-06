import React, { useRef, useState, useGlobal, useEffect } from 'reactn';
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
  // LayoutAnimation,
  ScrollView,
} from 'react-native';
// import { useKeyboard } from 'react-native-hooks';
// import { useDebouncedCallback, useDebounce } from 'use-debounce';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import loginAdminBG from '../assets/images/login-admin-bg.png';
import loginAdminTitleBG from '../assets/images/login-admin-title-bg.png';
import iconEmailImg from '../assets/images/icon-email.png';
import iconPasswordImg from '../assets/images/icon-password.png';
import iconRightGrey from '../assets/images/right-arrow-grey.png';
import {
  getStatusBarHeight,
  primaryPalette,
  isIphoneScreenWidthSmall,
  setCurrentSession,
  getCurrentSession,
  getCaughtAxiosErrorObj,
  emailValidator,
  isIpad,
} from '../utils';
import { scale } from 'react-native-size-matters';
import { HEIGHT_WINDOW } from '../utils/constants';
import {
  TextInputIconXL,
  RightElementXSign,
  LeftWrapper,
} from '../commons/components';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { INavigation } from '../..';
import { loginPOST } from '../services/backend';

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
  inputStyle: TextStyle;
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
    backgroundColor: primaryPalette.green,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bgImage: {
    // marginTop: getStatusBarHeight(),
    height: isIphoneScreenWidthSmall() ? HEIGHT_WINDOW * 0.25 : scale(395),
    // height: scale(395),

    width: '100%',
    backgroundColor: primaryPalette.green,
  },
  signInSection1: {
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: scale(37),
    borderTopLeftRadius: scale(37),
    backgroundColor: '#FFF',
    height: HEIGHT_WINDOW * 0.615,
    width: '100%',
    padding: scale(25),
  },
  signInSection1h3: {
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(17),
    lineHeight: scale(19),
    fontWeight: '800',

    marginTop: scale(10),
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
  inputStyle: {
    flex: 1,
    height: scale(73),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(21),
  },
  inputPasswordWrapperStyle: {
    // marginTop: scale(10),
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
    marginBottom: scale(isIpad() ? 0 : 40),
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

const IconComponentPassword = (): JSX.Element => (
  // <IconComponent name="email" size={scale(19)} />
  <Image
    style={styles.iconPasswordIMG}
    resizeMode="stretch"
    source={iconPasswordImg}
  />
);

interface RoundButtonProps extends INavigation, Partial<TouchableOpacityProps> {
  spinning?: boolean;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  // navigation,
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

const defaultHeight = isIpad() ? HEIGHT_WINDOW * 0.815 : HEIGHT_WINDOW * 0.615;

const RenderSection1: React.FC<INavigation> = (props): JSX.Element => {
  // const keyboard = useKeyboard();
  const [, setUserData] = useGlobal('currentUser');
  const [loading, setLoading] = useState(false);
  const [, setIsEmailValid] = useState(true);
  const [, setIsPasswordValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const [newHeight, setNewHeight] = useState(defaultHeight);
  const [firstTypePW, setFirstTypePW] = useState(true);
  const [firstTypeEmail, setFirstTypeEmail] = useState(true);

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
      if (!password) {
        setIsPasswordValid(false);
        return;
      }

      setLoading(true);

      const res = await loginPOST({
        data: {
          email: username,
          password,
        },
      });

      if (res && res.email && res.key) {
        await setCurrentSession({
          token: res.key,
          user: res,
        });

        await getCurrentSession(setUserData);
      }

      // console.log('res', res);
    } catch (e) {
      console.log('loginPOST', e);
      console.log('object', getCaughtAxiosErrorObj(e));
      Alert.alert('Unable to log in with provided credentials.');
    }

    setLoading(false);
  };

  const isKeyboardShow = useRef<string>('negative');
  const timeoutListener = useRef<globals.setTimeout>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const sub1 = Keyboard.addListener('keyboardDidShow', () => {
        setNewHeight(HEIGHT_WINDOW * 0.8);
        if (timeoutListener?.current) {
          clearTimeout(timeoutListener.current);
        }

        if (isKeyboardShow?.current) {
          isKeyboardShow.current = 'positive';
        }
      });

      const sub2 = Keyboard.addListener('keyboardDidHide', () => {
        if (isKeyboardShow?.current === 'positive') {
          isKeyboardShow.current = 'delaying';
        }

        timeoutListener.current = setTimeout(() => {
          if (isKeyboardShow.current === 'delaying') {
            isKeyboardShow.current = 'negative';
            setNewHeight(defaultHeight);
          }
        }, 600);
      });

      return (): void => {
        sub1.remove();
        sub2.remove();
      };
    }
  }, [isKeyboardShow.current]);

  return (
    <View
      style={[
        styles.signInSection1,
        {
          height: newHeight,
        },
      ]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flex: 1,
        }}>
        <Text style={styles.signInSection1h3}>SIGN IN</Text>
        {/* <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.body}> */}
        {/* <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{}}> */}
        <TextInputIconXL
          // isValid={true}

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rightElementCondition={(props_: any): boolean => {
            return !firstTypeEmail && emailValidator(props_) !== true;
          }}
          rightElement={RightElementXSign}
          wrapperStyle={styles.inputWrapperStyle}
          textInputProps={{
            ref: refUsername,
            style: styles.inputStyle,
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
              setFirstTypeEmail(false);
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
          leftIcon={(): JSX.Element => (
            <LeftWrapper>
              <IconComponentEmail />
            </LeftWrapper>
          )}
        />
        <TextInputIconXL
          // isValid={isFormValid}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rightElementCondition={(props_: any): boolean => {
            return !firstTypePW && props_.length === 0;
          }}
          rightElement={RightElementXSign}
          wrapperStyle={styles.inputPasswordWrapperStyle}
          textInputProps={{
            ref: refPassword,
            secureTextEntry: true,
            style: styles.inputStyle,
            returnKeyType: 'next',
            // autoCompleteType: 'email',
            // keyboardType: 'email-address',
            onChangeText: (text): void => {
              asyncClear();
              setFirstTypePW(false);
              setPassword(text);

              /* if (isFormValid !== true) {
                setIsFormValid(true);
                setRightError('');
                setTimeout(() => {
                  if (refPassword.current) {
                    ((refUsername.current || {}) as TextInput).focus();
                  }
                }, 120);
              } */
            },
            value: password,
            onSubmitEditing: async (): Promise<void> => {
              onSubmit();
              // if (refPassword.current) {
              //   ((refPassword.current || {}) as TextInput).focus();
              // }
            },
          }}
          leftIcon={(): JSX.Element => (
            <LeftWrapper>
              <IconComponentPassword />
            </LeftWrapper>
          )}
        />

        <RoundButton spinning={loading} onPress={onSubmit} {...props} />
        {/* </KeyboardAwareScrollView> */}

        <RenderFooter {...props} />
      </ScrollView>
    </View>
  );
};

const RenderFooter: React.FC<INavigation> = ({ navigation }) => {
  return (
    <View style={styles.footerWrapper}>
      <TouchableOpacity
        onPress={async (): Promise<void> => {
          navigation.navigate('Signup');
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: scale(40),
        }}>
        <Text style={styles.footerText}>Sign up</Text>
        <Image
          resizeMode="contain"
          style={styles.footerArrow}
          source={iconRightGrey}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('ForgotPassword');
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: '45%',
          height: scale(40),
          padding: scale(3),
        }}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginAdmin: React.FC<INavigation> = (props): JSX.Element => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('didFocus', () => {
      if (props.navigation?.state?.params?.state?.forgotPasswordMsg) {
        Alert.alert(props.navigation?.state?.params?.state?.forgotPasswordMsg);
        // props.navigation.setParams({ state: null });
      }
    });

    return (): void => {
      unsubscribe.remove();
    };
  }, []);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1, backgroundColor: primaryPalette.green }}
      //contentContainerStyle={styles.wrapper}
    >
      <StatusBar hidden translucent />
      <ImageBackground
        resizeMode="contain"
        style={styles.loginBG}
        imageStyle={styles.bgImage}
        source={loginAdminBG}>
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

export default LoginAdmin;
