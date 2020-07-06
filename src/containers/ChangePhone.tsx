import React, { useState, useRef, useGlobal, useEffect } from 'reactn';
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
  getDjangoModelErrorMessage,
  formatUSPhone,
} from '../utils';
import { INavigation } from '../..';
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
import { currentFormSel } from '../state_manager/selectors';
import { NavigationStackOptions } from 'react-navigation-stack';

interface ChangePhoneStyles {
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

const styles = StyleSheet.create<ChangePhoneStyles>({
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

const RenderPhoneField: React.FC = () => {
  const [, setCurrentForm] = useGlobal('currentForm');
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  const [value, setValue] = useState('');
  // value={phoneNumber}
  // setValue={async (text: string): Promise<void> => {
  //   await clearAsync();
  //   await setPhoneNumber(text)
  // }}
  const refUsername = useRef(null);

  return (
    <TextInputIconWithPrefix
      // isValid={isValid}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(text: any): boolean => {
        return validateUSPhoneNumber(text)?.valid !== true;
      }}
      prefix={'+1'}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
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
        onChangeText: (text: string): void => {
          // const formatted = new AsYouType('US').input(text);
          // setValue(formatted.replace(/[^\d+ ]/g, ''));
          // setCurrentForm({
          //   phoneNumber: formatted.replace(/[^\d+ ]/g, ''),
          // });

          const PREVIOUS_VALUE = '';
          const formatted = formatUSPhone(text, PREVIOUS_VALUE);
          setValue(formatted);
          setCurrentForm({
            phoneNumber: formatted,
          });

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

type ChangePhoneProps = INavigation;

interface ChangePhoneForm {
  phoneNumber: string;
  code: string;
}

const ChangePhone: React.FC<ChangePhoneProps> = props => {
  const [, setCurrentForm] = useGlobal('currentForm');
  const [loading, setLoading] = useState(false);

  // const [, setUserData] = useGlobal('currentUser');

  const clearAsync = async (): Promise<void> => {
    // setIsPhoneValid(true);
  };

  const validateAllAsync = async (): Promise<boolean> => {
    await clearAsync();
    const formData = currentFormSel() as ChangePhoneForm;

    const validPhoneResult = validateUSPhoneNumber(formData?.phoneNumber);
    if (validPhoneResult?.valid !== true) {
      // await setIsPhoneValid(false);
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
      const formData = currentFormSel() as ChangePhoneForm;

      const res = await getOTPPOST({
        data: {
          phone_number: formData?.phoneNumber,
        },
      });

      setCurrentForm({
        code: res.toString(),
        phoneNumber: formData?.phoneNumber,
      });

      props.navigation.navigate('ChangePhoneVerify');
    } catch (e) {
      console.log('ChangePhone getOTPPOST e', e, getDjangoModelErrorMessage(e));
      const msg = getDjangoModelErrorMessage(e);

      setLoading(false);
      setTimeout(() => {
        Alert.alert('', msg, [], {
          onDismiss: (): void => {
            return;
          },
        });
      }, 500);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    setCurrentForm({});
  }, []);

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
        <Text style={styles.title}>Change Phone Number</Text>
        <Image
          style={styles.verifyAccount}
          source={verifyAccountImg}
          resizeMode="contain"
        />
        <RenderPhoneField />
        <ButtonFloatingSubmit spinning={loading} onPress={onSubmitOtpAsync} />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ height: isIphoneScreenWidthSmall() ? scale(50) : 0 }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

ChangePhone.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default ChangePhone;
