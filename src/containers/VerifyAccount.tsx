import React, { useState, useRef } from 'reactn';
import {
  View,
  Text,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Image,
  StatusBar,
  TextStyle,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  scale,
  primaryPalette,
  validateUSPhoneNumber,
  isIphoneScreenWidthSmall,
  getCaughtAxiosErrorObj,
  formatUSPhone,
} from '../utils';
import { INavigation, NavigationVerifyAccountParam } from '../..';
import loginAdminTitleBG from '../assets/images/login-admin-title-bg.png';
import verifyAccountImg from '../assets/images/verify-account.png';
import iconPhoneImg from '../assets/images/icon-phone.png';
import {
  TextInputIconWithPrefix,
  ButtonFloatingSubmit,
  RightElementXSign,
  LeftWrapper,
} from '../commons/components';
import { getOTPPOST } from '../services/backend';
import { ERROR_500_MSG } from '../utils/constants';

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
}

const styles = StyleSheet.create<VerifyAccountStyles>({
  wrapper: {
    flex: 1,
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
    height: '110%',
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
    height: scale(300),
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
});

const IconComponentPhone: React.FC = () => (
  <Image
    style={styles.iconPhoneImg}
    resizeMode="stretch"
    source={iconPhoneImg}
  />
);

const RenderPhoneField: React.FC<{
  isValid: boolean;
  value: string;
  setValue: (text: string) => void;
}> = ({ value, setValue, isValid }) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const [value, setValue] = useState('');
  const refUsername = useRef(null);

  return (
    <TextInputIconWithPrefix
      isValid={isValid}
      rightElementCondition={(text: any): boolean => {
        return validateUSPhoneNumber(text)?.valid !== true;
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      prefix={'+1'}
      textInputProps={{
        ref: refUsername,
        style: {
          flex: 1,
          height: scale(50),
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(16),
          lineHeight: scale(21),
          // paddingVertical: scale(3)
        },
        placeholderTextColor: '#bebebe',
        placeholder: 'XXX-XXX-XXXX',
        returnKeyType: 'next',
        keyboardType: 'phone-pad',
        onSubmitEditing: (): void => {
          // setTimeout(() => {
          //   if (refPassword.current) {
          //     ((refPassword.current || {}) as TextInput).focus();
          //   }
          // }, 120);
        },
        onChangeText: (text): void => {
          // const formatted = new AsYouType('US').input(text);
          // setValue(formatted.replace(/[^\d+ ]/g, ''));
          const PREVIOUS_VALUE = '';
          const formatted = formatUSPhone(text, PREVIOUS_VALUE);
          setValue(formatted);
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <LeftWrapper>
          <IconComponentPhone />
        </LeftWrapper>
      )}
    />
  );
};

type VerifyAccountProps = INavigation<NavigationVerifyAccountParam>;

const getParamFromNav = (
  props: VerifyAccountProps,
  param: keyof NavigationVerifyAccountParam,
): string => {
  const { state } = props.navigation?.state?.params ??
    props.navigation.dangerouslyGetParent()?.state?.params ?? { state: {} };

  return state?.[param] ?? props.navigation.getParam(param) ?? '';
};

const VerifyAccount: React.FC<VerifyAccountProps> = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const profileType = getParamFromNav(props, 'profileType');
  const email = getParamFromNav(props, 'email'),
    name = getParamFromNav(props, 'name'),
    password = getParamFromNav(props, 'password'),
    dob = getParamFromNav(props, 'dob'),
    gender = getParamFromNav(props, 'gender');

  // const [, setUserData] = useGlobal('currentUser');

  const clearAsync = async (): Promise<void> => {
    setIsPhoneValid(true);
  };

  const validateAllAsync = async (): Promise<boolean> => {
    await clearAsync();

    const validPhoneResult = validateUSPhoneNumber(phoneNumber);
    if (validPhoneResult?.valid !== true) {
      await setIsPhoneValid(false);
      return false;
    }

    return true;
  };

  const onSubmitOtpAsync = async (): Promise<void> => {
    try {
      const isValid = await validateAllAsync();
      if (!isValid) {
        return;
      }

      if (loading) return;
      setLoading(true);

      const res = await getOTPPOST({
        data: {
          phone_number: phoneNumber,
        },
      });

      props.navigation.navigate('VerificationCode', {
        profileType,
        email,
        name,
        password,
        dob,
        gender,
        code: res.toString(),
        phoneNumber,
      });
    } catch (e) {
      console.log(
        'verifyaccount onSubmitOtpAsync or signupRes e',
        e,
        getCaughtAxiosErrorObj(e),
      );
      const msg = getCaughtAxiosErrorObj(e)?.error ?? ERROR_500_MSG;

      setLoading(false);
      setTimeout(() => {
        Alert.alert('', msg, [], {
          // onDismiss: (): void => {},
        });
      }, 500);
      return;
    }

    // async (): Promise<void> => {
    //   await setCurrentSession({
    //     token: '123',
    //     user: {} as UserDataUser,
    //   });
    //   getCurrentSession(setUserData)

    //   // props.navigation.navigate('Home')
    // }

    setLoading(false);
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
      <KeyboardAwareScrollView
        style={styles.body}
        // style={{
        //   flex: 1,
        //   padding: scale(20),
        //   flexDirection: 'column',
        //   alignItems: 'flex-start',
        //   justifyContent: 'center'
        // }}
        keyboardShouldPersistTaps="handled"
        // contentOffset={scale(300)}
      >
        <Text style={styles.title}>Verify Account</Text>
        <Text style={styles.pleaseVerifyText}>
          Please verify your account to start using discounts
        </Text>
        <Image
          style={styles.verifyAccount}
          source={verifyAccountImg}
          resizeMode="contain"
        />
        <RenderPhoneField
          isValid={isPhoneValid}
          value={phoneNumber}
          setValue={async (text: string): Promise<void> => {
            await clearAsync();
            await setPhoneNumber(text);
          }}
        />
        <ButtonFloatingSubmit spinning={loading} onPress={onSubmitOtpAsync} />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ height: isIphoneScreenWidthSmall() ? scale(50) : 0 }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VerifyAccount;
