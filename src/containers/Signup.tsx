import React, { useEffect } from 'reactn';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageStyle,
  StatusBar,
  TextStyle,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import signupSocialBG from '../assets/images/signup-social.png';
import loginAdminTitleBG from '../assets/images/login-admin-title-bg.png';
import iconRightGrey from '../assets/images/right-arrow-grey.png';
import {
  getStatusBarHeight,
  primaryPalette,
  setCurrentSession,
  getCurrentSession,
  isProfileInfoComplete,
  getDjangoModelErrorMessage,
  getAndroidScale,
  isIpad,
} from '../utils';
import { scale } from 'react-native-size-matters';
import { HEIGHT_WINDOW } from '../utils/constants';
import {
  GmailButton,
  FbButton,
  SignUpByEmailButton,
} from '../commons/components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import onPressGoogle from '../utils/ssoGoogle';
import onPressFacebook from '../utils/ssoFacebook';
import { INavigation, UserData, ProfilePropsNavigationState } from '../..';
import {
  socialFacebookAuthPOST,
  socialGoogleAuthPOST,
} from '../services/backend';
import { getUserSessionSel, isLoggedInSel } from '../state_manager/selectors';

const { useGlobal } = React;
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

  terms: TextStyle;
}

const styles = StyleSheet.create<LoginAdminStyle>({
  wrapper: {
    height: '102%',
    backgroundColor: primaryPalette.blue,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bgImage: {
    // marginTop: getStatusBarHeight(),
    // height: HEIGHT_WINDOW * 0.45,
    height: scale(395),
    marginLeft: '10%',
    width: '80%',
    backgroundColor: primaryPalette.blue,
  },
  signInSection1: {
    // position: 'absolute',
    // bottom: 10,
    marginTop:
      getAndroidScale() < 1
        ? HEIGHT_WINDOW * 0.43 * getAndroidScale()
        : HEIGHT_WINDOW * 0.43,
    borderTopRightRadius: scale(37),
    borderTopLeftRadius: scale(37),
    backgroundColor: '#FFF',
    height:
      getAndroidScale() < 1
        ? HEIGHT_WINDOW * 0.57 * (1 - getAndroidScale() + 1)
        : HEIGHT_WINDOW * 0.57,
    width: '100%',
    paddingTop: isIphoneX() ? scale(25) : 0,
    paddingHorizontal: scale(25),
    // paddingBottom: scale(5)
  },
  signInSection1h3: {
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(17),
    lineHeight: scale(19),
    fontWeight: '800',

    marginVertical: scale(25),
  },

  iconArrowWrapper: {
    bottom: getStatusBarHeight(true) + scale(20),
    right: scale(15),
    position: 'absolute',
    alignSelf: 'flex-end',

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
    left: '27%',
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
    marginTop:
      getAndroidScale() < 1 ? -scale(20) : isIpad() ? -scale(10) : scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  terms: {
    fontFamily: 'Avenir',
    fontSize: scale(14),
    lineHeight: scale(18),
    color: primaryPalette.dark,
    fontWeight: '400',
  },
});

const RenderSection1: React.FC<INavigation> = (props): JSX.Element => {
  const [, setUserData] = useGlobal('currentUser');
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const [username, setUsername] = useState('user@email.com');
  // const [password, setPassword] = useState('');
  // const refUsername = useRef(null);
  // const refPassword = useRef(null);

  return (
    <View style={styles.signInSection1}>
      <Text style={styles.signInSection1h3}>SIGN UP</Text>

      <GmailButton
        onPress={async (): Promise<void> => {
          try {
            const res = await onPressGoogle();

            if (res.cancelled) {
              return;
            }

            const socialUser = await socialGoogleAuthPOST({
              data: {
                access_token: res.jwtAccessToken,
              },
            });

            console.log('socialUsersocialUser', socialUser);

            if (socialUser && socialUser.key) {
              await setCurrentSession(({
                token: socialUser.key,
                user: socialUser,
              } as unknown) as UserData);

              // 1. this sets the user session in reactn global store
              // 2. which triggers the App.tsx useeffect
              // 3. and sends user to appropriate screen
              // 4. basically forces to fillup account info form if first time user
              await getCurrentSession(setUserData);
              const navState: ProfilePropsNavigationState = {
                type: 'gmail',
                socialUser,
              };
              props.navigation.navigate('ProfileForm', navState);
            }

            // console.log('gmailresres', res);
          } catch (e) {
            const msg = getDjangoModelErrorMessage(e);
            Alert.alert(msg);
            console.log('onpressGoogle e', e);
          }
        }}
        styleswrapper={{ marginBottom: scale(25) }}
      />
      <FbButton
        onPress={async (): Promise<void> => {
          try {
            const res = await onPressFacebook();

            if (res.cancelled) {
              return;
            }

            const socialUser = await socialFacebookAuthPOST({
              data: {
                access_token: res.jwtAccessToken,
              },
            });

            if (socialUser && socialUser.key) {
              await setCurrentSession(({
                token: socialUser.key,
                user: socialUser,
              } as unknown) as UserData);

              // 1. this sets the user session in reactn global store
              // 2. which triggers the App.tsx useeffect
              // 3. and sends user to appropriate screen
              // 4. basically forces to fillup account info form if first time user
              await getCurrentSession(setUserData);
              const navState: ProfilePropsNavigationState = {
                type: 'fb',
                socialUser,
              };
              props.navigation.navigate('ProfileForm', navState);
            }

            // const bool = await isEmailRegisteredAsync(res?.user?.email as string);
            // if (bool) {
            //   await setCurrentSession(({
            //     token: '123-dummy',
            //     user: {
            //       email: 'dummy@test.com'
            //     }
            //   }) as unknown as UserData);
            //   await getCurrentSession(setUserData);
            //   return;
            // }

            // console.log('fbresres', res);
          } catch (e) {
            console.log('onPressFacebook e', e);
          }
        }}
        styleswrapper={{
          marginBottom: scale(25),
          backgroundColor: primaryPalette.blueFB,
        }}
        stylesicon={{
          height: scale(30),
          width: scale(27),
        }}
      />
      <SignUpByEmailButton
        onPress={(): void => {
          props.navigation.navigate('ProfileForm');
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        styleswrapper={{
          marginBottom: scale(25),
          backgroundColor: primaryPalette.light,
          borderColor: '#c7c7c7',
          borderWidth: 1,
        }}
        stylestext={{
          color: primaryPalette.dark,
        }}
        stylesicon={{
          height: scale(30),
          width: scale(27),
        }}
        rightIcon={iconRightGrey}
      />
      <RenderFooter {...props} />
    </View>
  );
};

const RenderFooter: React.FC<INavigation> = ({ navigation }) => {
  return (
    <View style={styles.footerWrapper}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('LoginAdmin');
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: '45%',
          height: scale(40),
          flexDirection: 'row',
          padding: scale(3),
        }}>
        <Text style={styles.footerText}>Sign in</Text>
        <Image
          resizeMode="contain"
          style={styles.footerArrow}
          source={iconRightGrey}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('TermsAndAgreement');
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: '45%',
          height: scale(40),
          padding: scale(3),
        }}>
        <Text style={styles.terms}>Terms & Conditions</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUp: React.FC<INavigation> = (props): JSX.Element => {
  useEffect(() => {
    const user = getUserSessionSel().user;
    if (isLoggedInSel() === true && isProfileInfoComplete(user) === false) {
      const navState: ProfilePropsNavigationState = {
        type: 'fb', // or gmail?
        socialUser: user,
      };
      props.navigation.navigate('ProfileForm', navState);
    }
  }, [isLoggedInSel()]);

  return (
    <ScrollView
      style={{ backgroundColor: primaryPalette.blue }}
      contentContainerStyle={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        resizeMode="contain"
        style={styles.loginBG}
        imageStyle={styles.bgImage}
        source={signupSocialBG}>
        <Image
          resizeMode="contain"
          style={styles.titleBGImage}
          source={loginAdminTitleBG}
        />
        <RenderSection1 {...props} />
      </ImageBackground>
    </ScrollView>
  );
};

export default SignUp;
