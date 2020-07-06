import React, { useState, useGlobal } from 'reactn';
import {
  View,
  Text,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Image,
  StatusBar,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  scale,
  primaryPalette,
  getCaughtAxiosErrorObj,
  getMappedGender,
  setCurrentSession,
  isIphoneScreenWidthSmall,
} from '../utils';
import { INavigation, NavigationVerificationCodeParam } from '../..';
import loginAdminTitleBG from '../assets/images/login-admin-title-bg.png';
import verificationCodeImg from '../assets/images/verification-code-bg.png';
import iconPhoneImg from '../assets/images/icon-phone.png';
import { ButtonFloatingSubmit } from '../commons/components';
import CodeInput from 'react-native-confirmation-code-input';
import { editProfilePATCH, getOTPPOST, signupPOST } from '../services/backend';
import { ERROR_500_MSG } from '../utils/constants';
import { getUserSessionSel } from '../state_manager/selectors';
import moment from 'moment';

interface VerifyAccountStyles {
  wrapper: ViewStyle;
  header: ViewStyle;
  titleBGImage: ImageStyle;
  body: ViewStyle;
  title: TextStyle;
  pleaseVerifyText: TextStyle;
  verifyAccount: ImageStyle;
  iconPhoneImg: ImageStyle;
  inputWrapperStyle: ViewStyle;
  checkSubmitBtn: ViewStyle;
  checkSubmit: ImageStyle;
  resendText: TextStyle;

  resendBtn: ViewStyle;
}

const styles = StyleSheet.create<VerifyAccountStyles>({
  wrapper: {
    height: '120%',
    backgroundColor: primaryPalette.orange,
  },
  header: {
    height: scale(130),
    backgroundColor: primaryPalette.orange,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleBGImage: {
    position: 'absolute',
    // top: getStatusBarHeight(true),
    left: '28%',
    width: '46%',
    // height: scale(55),
  },
  body: {
    // height: '120%',
    flex: 1,
    paddingVertical: scale(40),
    paddingHorizontal: scale(25),
    backgroundColor: primaryPalette.light,
    borderTopRightRadius: scale(40),
    borderTopLeftRadius: scale(40),
  },
  title: {
    fontWeight: '800',
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(18),
    lineHeight: scale(22),
  },
  pleaseVerifyText: {
    color: primaryPalette.dark,
    fontFamily: 'Avenir',
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '300',

    marginTop: scale(10),
  },
  verifyAccount: {
    width: '100%',
    height: scale(200),
    marginVertical: scale(30),
  },
  inputWrapperStyle: {
    marginTop: scale(25),
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
    paddingBottom: scale(12),
  },
  iconPhoneImg: {
    width: scale(13),
    height: scale(20),
  },
  checkSubmitBtn: {
    marginTop: scale(40),
    borderRadius: scale(40),
    width: scale(50),
    height: scale(50),
    alignSelf: 'flex-end',
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  checkSubmit: {
    width: scale(58),
    height: scale(58),
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    paddingHorizontal: scale(5),
    color: primaryPalette.blue,
    fontFamily: 'Avenir',
    fontSize: scale(18),
    lineHeight: scale(32),
    fontWeight: '500',
  },
  resendBtn: {
    marginTop: scale(20),
    alignSelf: 'flex-end',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
});

const IconComponentPhone: React.FC = () => (
  <Image
    style={styles.iconPhoneImg}
    resizeMode="stretch"
    source={iconPhoneImg}
  />
);

type VerifyAccountProps = INavigation<NavigationVerificationCodeParam>;

const VerificationCode: React.FC<VerifyAccountProps> = props => {
  const [, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const expectedCode = props.navigation.getParam('code') ?? '------';
  const profileType = props.navigation.getParam('profileType');
  const phoneNumber = props.navigation.getParam('phoneNumber');
  const email = props.navigation.getParam('email'),
    name = props.navigation.getParam('name'),
    password = props.navigation.getParam('password'),
    dob = props.navigation.getParam('dob'),
    gender = props.navigation.getParam('gender');

  const [, setUserData] = useGlobal('currentUser');
  const userData = getUserSessionSel();

  const onSubmitOtpAsync = async (codeInput: string): Promise<void> => {
    try {
      if (!codeInput) {
        Alert.alert('Please enter the code.');
        return;
      } else if (codeInput !== expectedCode) {
        Alert.alert('Please try again', 'Invalid code');
        return;
      }

      if (loading) return;
      setLoading(true);
      const editResult = await editProfilePATCH({
        data: {
          id: userData.user.id,
          otp: codeInput,
          phone_number: phoneNumber,
          name,
          // password,
          dob: moment(dob).format('YYYY-MM-DD'),
          gender: getMappedGender(gender),
        },
      });

      if (editResult && editResult.id && editResult.email) {
        await setCurrentSession({
          token: userData.token,
          user: {
            ...userData.user,
            ...editResult,
          },
        });

        /* 
         call this after confrimation screen instead
         await getCurrentSession(setUserData);
        */
      }
    } catch (e) {
      console.log(
        'onSubmitOtpAsync or signupRes e',
        e,
        getCaughtAxiosErrorObj(e),
      );

      setLoading(false);
      setTimeout(() => {
        Alert.alert('', ERROR_500_MSG, [], {
          onDismiss: (): void => {
            return;
          },
        });
      }, 500);
      return;
    }

    setTimeout(() => {
      props.navigation.navigate('Confirmation');
    }, 500);
    setLoading(false);
  };

  const onSubmitOtpNewUserAsync = async (codeInput: string): Promise<void> => {
    try {
      if (!codeInput) {
        Alert.alert('Please enter the code.');
        return;
      } else if (codeInput !== expectedCode) {
        Alert.alert('Please try again', 'Invalid code');
        return;
      }

      if (loading) return;
      setLoading(true);

      const registerResult = await signupPOST({
        data: {
          email,
          otp: codeInput,
          phone_number: phoneNumber,
          name,
          password1: password,
          password2: password,
          dob: moment(dob).format('YYYY-MM-DD'),
          gender: gender,
        },
      });

      if (registerResult && registerResult.id && registerResult.email) {
        await setCurrentSession({
          token: registerResult.key,
          user: {
            ...registerResult,
          },
        });

        /* 
         call below after confrimation screen instead:

         await getCurrentSession(setUserData);
        */
      }
    } catch (e) {
      const msgObj = getCaughtAxiosErrorObj(e);
      const msg = ((msgObj?.error ??
        msgObj?.email ??
        msgObj?.phone_number ??
        msgObj?.name ??
        msgObj?.password1 ??
        msgObj?.dob ??
        ((msgObj as unknown) as string)) as unknown) as string;
      console.log(
        'onSubmitOtpAsync or signupRes e',
        e,
        getCaughtAxiosErrorObj(e),
      );

      setLoading(false);
      setTimeout(() => {
        Alert.alert('', msg ? msg : ERROR_500_MSG, [], {
          // onDismiss: (): void => {},
        });
      }, 500);
      return;
    }

    setTimeout(() => {
      props.navigation.navigate('Confirmation');
    }, 500);
    setLoading(false);
  };

  const onSubmitCodeEntered = async (
    isValidOrCode: boolean | string,
    codeText?: string,
  ): Promise<void> => {
    setCode('');
    if (codeText) {
      if (isValidOrCode === true) {
        setCode(codeText);

        // setTimeout(() => {
        profileType === 'fb' || profileType === 'gmail'
          ? onSubmitOtpAsync(codeText)
          : onSubmitOtpNewUserAsync(codeText);
        // }, 500)
      } else {
        Alert.alert('Please try again', 'Invalid code');
        return;
      }
    } else if (isValidOrCode === false) {
      Alert.alert('Please try again', 'Invalid code');
      return;
    }
    // console.log('eiei', isValid)
    // if (!isValid) {
    //   Alert.alert('Please try again', 'Invalid code');
    // }
  };

  const onResendCodeAsync = async (): Promise<void> => {
    try {
      await getOTPPOST({
        data: {
          phone_number: phoneNumber,
        },
      });
    } catch (e) {
      console.log('onResendCodeAsync e', e, getCaughtAxiosErrorObj(e));
      const msg = getCaughtAxiosErrorObj(e)?.error;
      Alert.alert(msg ? msg : ERROR_500_MSG);
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          style={styles.titleBGImage}
          source={loginAdminTitleBG}
        />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.body}>
        <KeyboardAwareScrollView
          // contentContainerStyle={styles.body}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            flex: 1,
            padding: scale(20),
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.pleaseVerifyText}>
            Enter 6 digit OTP sent to phone number {phoneNumber}
          </Text>
          {/* <CodeInput
          // ref="codeInputRef1"
          secureTextEntry
          className={'border-b'}
          space={5}
          size={30}
          inputPosition='left'
          onFulfill={(code) => this._onFulfill(code)}
        /> */}
          <Image
            style={styles.verifyAccount}
            source={verificationCodeImg}
            resizeMode="contain"
          />

          <CodeInput
            // ref="codeInputRef2"
            // secureTextEntry
            keyboardType="numeric"
            compareWithCode={expectedCode}
            activeColor="rgba(49, 180, 4, 1)"
            inactiveColor="rgba(49, 180, 4, 1.3)"
            className={'border-b'}
            autoFocus={false}
            // ignoreCase={true}
            inputPosition="left"
            codeLength={6}
            space={scale(15)}
            size={scale(40)}
            onFulfill={onSubmitCodeEntered}
            // onCodeChange={(text: string): void => {
            //   console.log('changin', text);
            //   setCode(text);
            // }}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{ alignSelf: 'center', marginTop: scale(40) }}
            // eslint-disable-next-line react-native/no-inline-styles
            codeInputStyle={{
              color: '#38032e',
              fontFamily: 'Avenir',
              fontSize: scale(30),
              fontWeight: '800',
              borderBottomColor: 'rgba(44,44,44,0.2)',
            }}
          />

          {/* <CodeInput
          // ref="codeInputRef2"
          keyboardType="numeric"
          codeLength={5}
          className='border-circle'
          compareWithCode='12345'
          autoFocus={false}
          codeInputStyle={{ fontWeight: '800' }}
          onFulfill={(isValid, code) => this._onFinishCheckingCode2(isValid, code)}
        /> */}
          <TouchableOpacity
            style={styles.resendBtn}
            onPress={(): void => {
              onResendCodeAsync();
            }}>
            <Text style={styles.resendText}>Resend Code?</Text>
          </TouchableOpacity>
          <ButtonFloatingSubmit
            spinning={loading}
            onPress={
              profileType === 'fb' || profileType === 'gmail'
                ? onSubmitOtpAsync
                : onSubmitOtpNewUserAsync
            }
          />
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ height: isIphoneScreenWidthSmall() ? scale(150) : 0 }}
          />
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default VerificationCode;
