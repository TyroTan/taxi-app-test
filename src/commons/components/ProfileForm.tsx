import React, {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
} from 'react';
import {
  View,
  Text,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Image,
  StatusBar,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
  Alert,
  TextInput,
} from 'react-native';
import {
  scale,
  primaryPalette,
  getCaughtAxiosErrorObj,
  getMappedGender,
  emailValidator,
  getMappedGenderLabel,
  isIphoneScreenWidthSmall,
} from '../../utils';
import { INavigation, ProfilePropsNavigationState } from '../../..';
import loginAdminTitleBG from '../../assets/images/login-admin-title-bg.png';
import iconPersonImg from '../../assets/images/icon-person.png';
import iconPasswordImg from '../../assets/images/icon-password.png';
import iconEmailImg from '../../assets/images/icon-email.png';
import iconBirthdayImg from '../../assets/images/icon-birthday.png';
import {
  ButtonFloatingSubmit,
  RightElementXSign,
  LeftWrapper,
  TextInputIconXL,
  RightElementCheckSign,
} from '.';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputMask } from 'react-native-masked-text';
import { signupValidatePOST } from '../../services/backend';
import { useGlobal } from 'reactn';
import moment from 'moment';
import { getUserSessionSel } from '../../state_manager/selectors';
import { DATE_FORMAT_STRING } from '../../utils/constants';

interface ProfileStyles {
  wrapper: ViewStyle;
  header: ViewStyle;
  titleBGImage: ImageStyle;
  body: ViewStyle;
  title: TextStyle;
  iconPersonImg: ImageStyle;
  iconEmailImg: ImageStyle;
  iconDOBImg: ImageStyle;
  inputWrapperStyle: ViewStyle;
  inputStyle: TextStyle;
  iconPersonWrapper: ViewStyle;
}

const styles = StyleSheet.create<ProfileStyles>({
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
    paddingBottom: 0,
    paddingVertical: scale(40),
    paddingHorizontal: scale(30),
    backgroundColor: primaryPalette.light,
    borderTopEndRadius: scale(40),
    borderTopStartRadius: scale(40),
  },
  title: {
    fontWeight: '800',
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(18),
    lineHeight: scale(22),
    marginBottom: scale(25),
  },
  inputWrapperStyle: {
    // borderWidth: 1,
    // borderColor: 'red',
    // marginTop: scale(25),
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
    // paddingBottom: scale(12),
  },
  inputStyle: {
    flex: 1,
    height: scale(73),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(21),
  },
  iconPersonImg: {
    width: scale(18),
    height: scale(18),
  },
  iconEmailImg: {
    width: scale(18),
    height: scale(13),
  },
  iconDOBImg: {
    width: scale(22),
    height: scale(22),
  },
  iconPersonWrapper: {
    width: '10%',
  },
});

const IconComponentPerson: React.FC = () => (
  <Image
    style={styles.iconPersonImg}
    resizeMode="stretch"
    source={iconPersonImg}
  />
);

const IconComponentEmail: React.FC = () => (
  <Image
    style={styles.iconEmailImg}
    resizeMode="stretch"
    source={iconEmailImg}
  />
);

const IconComponentPassword: React.FC = () => (
  <Image
    style={styles.iconPersonImg}
    resizeMode="stretch"
    source={iconPasswordImg}
  />
);

const IconComponentDOB: React.FC = () => (
  <Image
    style={styles.iconDOBImg}
    resizeMode="stretch"
    source={iconBirthdayImg}
  />
);

interface FieldProps extends INavigation, Partial<TextInputProps> {
  refInput?: RefObject<TextInput>;
  value: string;
  setValue: (text: string) => void;
  validateField?: (param: string) => boolean;
}

const RenderNameField: React.FC<FieldProps> = ({
  value,
  setValue,
  onSubmitEditing,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props: any): boolean => {
        return props.length === 0;
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'Name',
        returnKeyType: 'next',
        onSubmitEditing,
        onChangeText: (text): void => {
          setValue(text);
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <View style={styles.iconPersonWrapper}>
          <IconComponentPerson />
        </View>
      )}
    />
  );
};

const RenderEmailField: React.FC<FieldProps> = ({
  value,
  setValue,
  editable,
  refInput,
}) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  // const [rightError, setRightError] = useState('');
  // const [value, setValue] = useState('');
  // const refUsername = useRef(null);

  const clearAsync = async (): Promise<void> => {
    setIsEmailValid(false);
    setIsFormValid(true);
  };

  const validateAllAsync = async (): Promise<void> => {
    await clearAsync();
    if (emailValidator(value) === true) {
      setIsEmailValid(true);
    } else {
      setIsFormValid(false);
    }
    return;
  };

  return (
    <TextInputIconXL
      isValid={isFormValid}
      // rightElement={(!editable || isEmailValid) ? () => <IconComponentCheck /> : null}
      rightElementCondition={(): boolean => {
        return !editable || isEmailValid;
      }}
      rightElement={RightElementCheckSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        editable,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: editable ? 'Email' : value,
        returnKeyType: 'next',
        keyboardType: 'email-address',
        // onSubmitEditing: (): void => {},
        onBlur: (): void => {
          validateAllAsync();
        },
        onChangeText: async (text): Promise<void> => {
          setValue(text.toLowerCase());
        },
        value: editable ? value : '',
      }}
      leftIcon={(): JSX.Element => (
        <View style={styles.iconPersonWrapper}>
          <IconComponentEmail />
        </View>
      )}
    />
  );
};

const RenderPasswordField: React.FC<FieldProps> = ({
  value,
  setValue,
  refInput,
}) => {
  const [isFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      isValid={isFormValid}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props: any): boolean => {
        return props.length === 0;
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        // placeholderTextColor: '#bebebe',
        // placeholder: 'Name',
        secureTextEntry: true,
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing: (): void => {
          // setTimeout(() => {
          //   if (refPassword.current) {
          //     ((refPassword.current || {}) as TextInput).focus();
          //   }
          // }, 120);
        },
        onChangeText: (text): void => {
          setValue(text.toLowerCase());

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
          <IconComponentPassword />
        </LeftWrapper>
      )}
    />
  );
};

const RenderBirthdayField: React.FC<FieldProps> = ({
  value,
  setValue,
  refInput,
}) => {
  // const [value, setValue] = useState('01/01/2020');
  return (
    <View
      style={[
        styles.inputWrapperStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // paddingRight: scale(15),
          padding: 0,
          borderBottomWidth: 0,
        },
      ]}>
      <IconComponentDOB />
      <TextInputMask
        ref={refInput}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          marginLeft: '4%',
          height: scale(73),
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(16),
          lineHeight: scale(24),
        }}
        type={'datetime'}
        options={{
          format: `${DATE_FORMAT_STRING}`,
        }}
        placeholder={DATE_FORMAT_STRING}
        placeholderTextColor="#a0a0a0"
        // dont forget to set the "value" and "onChangeText" props
        validator={(dob: string): boolean => {
          return moment(dob).isValid() && !moment(dob).isAfter(new Date());
        }}
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
};

type GenderType = 'Male' | 'Female' | 'Other';

interface RenderGenderOptionProps extends INavigation {
  label: GenderType;
  isActive: boolean;
  onPress: () => void;
}
const RenderGenderOption: React.FC<RenderGenderOptionProps> = ({
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: scale(100),
        height: scale(48),
        borderRadius: scale(24),
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderWidth: isActive ? 0 : 1,
        backgroundColor: isActive ? '#10bccc' : '#ffffff',
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          lineHeight: scale(45),
          textAlign: 'center',
          color: isActive ? '#FFF' : '#a0a0a0',
          fontFamily: 'Avenir',
          fontSize: scale(16),
          fontWeight: '500',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface RenderGenderFieldProps extends INavigation {
  activeGender: GenderType;
  setActiveGender: Dispatch<SetStateAction<GenderType>>;
}

const RenderGenderField: React.FC<RenderGenderFieldProps> = props => {
  return (
    <View
      style={[
        styles.inputWrapperStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: scale(15),
          borderBottomWidth: 0,
        },
      ]}>
      <RenderGenderOption
        {...{
          ...props,
          isActive: props.activeGender === 'Male',
          label: 'Male',
          onPress: (): void => {
            props.setActiveGender('Male');
          },
        }}
      />
      <RenderGenderOption
        {...{
          ...props,
          isActive: props.activeGender === 'Female',
          label: 'Female',
          onPress: (): void => {
            props.setActiveGender('Female');
          },
        }}
      />
      <RenderGenderOption
        {...{
          ...props,
          isActive: props.activeGender === 'Other',
          label: 'Other',
          onPress: (): void => {
            props.setActiveGender('Other');
          },
        }}
      />
    </View>
  );
};

type ProfileProps = INavigation<ProfilePropsNavigationState>;

const Profile: React.FC<ProfileProps> = props => {
  // ! don't delete even if unused
  const [, setUserData] = useGlobal('currentUser');
  const userData = getUserSessionSel().user;
  const profileFormType = props.navigation.getParam('type');
  const isProfileFormTypeSocialLogin =
    profileFormType === 'gmail' || profileFormType === 'fb';
  const socialUser = props.navigation.getParam('socialUser') ?? userData;
  // console.log('socialUsersocialUser', socialUser);
  const profileSocialEmail = socialUser?.email ?? '';
  const isEmailEditable = !(profileFormType && profileSocialEmail);
  const [activeGender, setActiveGender] = useState<GenderType>(
    getMappedGenderLabel(socialUser?.gender ?? 'F'),
  );
  const [name, setName] = useState<string>(socialUser?.name ?? '');
  const [email, setEmail] = useState<string>(socialUser?.email ?? '');
  const [password, setPassword] = useState<string>('');
  const [dob, setDob] = useState<string>(socialUser?.dob ?? '');
  const [loading, setLoading] = useState(false);
  const [, setIsNameValid] = useState(true);

  const refName = useRef<TextInput & { isValid: () => boolean }>(null);
  const refDOB = useRef<TextInput & { isValid: () => boolean }>(null);
  const refEmail = useRef<TextInput & { isValid: () => boolean }>(null);
  const refPassword = useRef<TextInput & { isValid: () => boolean }>(null);

  // useEffect(() => {
  // }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateName: <P>(p: P) => boolean = (p: any) => {
    return p.length > 0;
  };

  const onValidateViaBackend = async (): Promise<boolean> => {
    try {
      if (!name) {
        await setIsNameValid(false);
        return false;
      }
      // if (refDOB?.current) {
      // if (!refDOB?.current?.isValid()) {
      // if (!moment(dob).isValid()) {
      if (!moment(dob).isValid()) {
        Alert.alert(
          'Invalid Birthday',
          `Kindly check if the date is valid\n(${DATE_FORMAT_STRING}`,
        );
        return false;
      }
      if (moment(dob).isAfter(new Date())) {
        Alert.alert(
          'Invalid future date on Birthday',
          `Kindly check if the date is valid\n(${DATE_FORMAT_STRING}`,
        );
        return false;
      }
      // }
      // }

      await setLoading(true);
      await signupValidatePOST({
        data: {
          name,
          email,

          password1: password,
          password2: password,

          dob: moment(dob).format('YYYY-MM-DD'),
          gender: getMappedGender(activeGender),
          phone_number: '',
          otp: '',
        },
      });
      await setLoading(false);

      return true;
    } catch (e) {
      await setLoading(false);
      const eObj = getCaughtAxiosErrorObj(e);
      console.log('eObj keys', Object.keys(eObj), eObj);
      // if (isProfileFormTypeSocialLogin) {
      // if (eObj?.email?.[0]) { // email already exist per backend check

      // return false
      // }
      // }

      const errMessagePriority = eObj?.email?.[0] ?? eObj?.password1?.[0];
      // const otherKey = Object.keys(eObj).filter(k => k !== 'email' && k !== 'password')?.[0]
      // const errMessage = errMessagePriority ?? eObj?.[otherKey]
      // (Object.keys(eObj)./(k => k !== 'email' && k !== 'password')?.[0])
      // if (errMessage) {
      //   Alert.alert('Please check your input', errMessage);
      // } else {
      //   Alert.alert(ERROR_500_MSG);
      // }

      if (errMessagePriority) {
        Alert.alert(errMessagePriority);
      } else {
        return true;
      }
    }

    return false;
  };

  const onSubmitRegister = async (): Promise<void> => {
    try {
      if (loading) return;
      const res = await onValidateViaBackend();
      if (res !== true) {
        return;
      }
      if (!name) {
        setIsNameValid(false);
        return;
      } else if (!email || !dob) {
        return;
      }

      props.navigation.navigate('VerifyAccount', {
        state: {
          // profileType: profileFormType,
          name,
          email,
          password,
          dob,
          gender: getMappedGender(activeGender),
        },
      });
    } catch (e) {
      console.log('onSubmitRegister e', e, getCaughtAxiosErrorObj(e));
    }
  };

  const onSubmitEditProfile = async (): Promise<void> => {
    try {
      if (loading) return;
      // const res = await onValidateViaBackend();
      // if (res !== true) {
      //   return;
      // }
      if (!name) {
        setIsNameValid(false);
        return;
      } else if (!email || !dob) {
        return;
      }
      if (!moment(dob).isValid()) {
        Alert.alert(
          'Invalid Birthday',
          `Kindly check if the date is valid\n(${DATE_FORMAT_STRING})`,
        );
        return;
      }

      props.navigation.navigate('VerifyAccount', {
        state: {
          profileType: profileFormType,
          name,
          dob,
          gender: getMappedGender(activeGender),
        },
      });
    } catch (e) {
      console.log('onSubmitEditProfile e', e, getCaughtAxiosErrorObj(e));
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
      {/* <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.body}> */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.body}>
        <Text style={styles.title}>Account Info</Text>
        <RenderNameField
          refInput={refName}
          validateField={validateName}
          {...props}
          value={name}
          setValue={(text: string): void => {
            setName(text);
          }}
          onSubmitEditing={(): void => {
            if (isEmailEditable && refEmail?.current) {
              refEmail?.current?.focus();
            } else if (refPassword?.current) {
              refPassword?.current?.focus();
            }
          }}
        />
        <RenderEmailField
          refInput={refEmail}
          {...props}
          value={email}
          setValue={setEmail}
          editable={isEmailEditable}
        />
        {isProfileFormTypeSocialLogin ? (
          <></>
        ) : (
          <RenderPasswordField
            refInput={refPassword}
            {...props}
            value={password}
            setValue={setPassword}
          />
        )}
        <RenderBirthdayField
          {...props}
          refInput={refDOB}
          value={dob}
          setValue={setDob}
        />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            color: '#38032e',
            fontFamily: 'Avenir',
            fontSize: scale(20),
            fontWeight: '500',
            marginTop: scale(30),
            marginBottom: scale(15),
          }}>
          Gender
        </Text>
        <RenderGenderField
          {...props}
          activeGender={activeGender}
          setActiveGender={setActiveGender}
        />
        <ButtonFloatingSubmit
          onPress={(): void => {
            if (isProfileFormTypeSocialLogin) {
              onSubmitEditProfile();
            } else {
              onSubmitRegister();
            }
          }}
          spinning={loading}
        />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ height: isIphoneScreenWidthSmall() ? scale(50) : 0 }} />
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
    </View>
  );
};

export default Profile;
