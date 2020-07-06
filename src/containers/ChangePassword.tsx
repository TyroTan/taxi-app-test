import React, { useEffect, useState, useRef, RefObject } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInputProps,
  TextInput,
  Alert,
} from 'react-native';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getDjangoModelErrorMessage,
} from '../utils';
import backImg from '../assets/images/back-black.png';
import {
  Divider,
  TextInputIconXL,
  RightElementXSign,
} from '../commons/components';
import { INavigation } from '../..';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGlobal } from 'reactn';
import { currentFormSel } from '../state_manager/selectors';
import { changePasswordPOST } from '../services/backend';
import Modal from 'react-native-modal';
import { NavigationStackOptions } from 'react-navigation-stack';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: getStatusBarHeight(true) + scale(5),
  },
  body: {
    marginHorizontal: scale(22),
  },
  header: {
    // height: scale(50),
    flexDirection: 'column',
    padding: scale(10),
    marginBottom: scale(10),
  },
  headerBackBtn: {
    height: scale(32),
    width: scale(32),
    paddingVertical: scale(5),
    marginLeft: scale(-3),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerBackImg: {
    height: scale(22),
    width: scale(22),
  },
  headerTitle: {
    // height: scale(30),
    borderColor: 'yellow',
    fontFamily: 'Avenir',
    fontSize: scale(28),
    lineHeight: scale(42),
    fontWeight: '700',
    color: primaryPalette.dark,
  },
  earningsWrapper: {
    // padding: '10%',
    width: '90%',
    marginHorizontal: '5%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsBGImg: {
    height: scale(100),
    width: '100%',
  },
  h3: {
    paddingTop: scale(10),
    fontFamily: 'Avenir',
    fontSize: scale(20),
    lineHeight: scale(30),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  h3Value: {
    fontFamily: 'Avenir',
    fontSize: scale(35),
    lineHeight: scale(44),
    fontWeight: '600',
    color: primaryPalette.orangeLight,
  },
  h4: {
    paddingTop: scale(10),
    paddingHorizontal: scale(15),
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  footer: {
    marginTop: scale(30),
    // height: scale(150),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftBtn: {
    flex: 1,
    width: '80%',
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: primaryPalette.blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(20),
  },
  leftBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.light,
  },
  rightBtn: {
    flex: 1,
    width: '80%',
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: primaryPalette.orange,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(20),
  },
  rightBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.light,
  },
  progress: {
    // paddingHorizontal: '5%',
    width: '100%',
    marginVertical: scale(5),
    // backgroundColor: 'rgba(46,46,46, 0.1)',
    borderColor: primaryPalette.light,
  },
  item: {
    width: '100%',
    marginTop: scale(15),
    padding: scale(7),
    paddingTop: scale(0),
    borderWidth: 1,
    borderRadius: scale(5),
    borderColor: 'rgba(45,45,45, 0.5)',
  },
  progressStatusText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: '#a0a0a0',
  },
  submitBtn: {
    height: scale(56),
    width: scale(185),
    borderRadius: scale(32),
    backgroundColor: primaryPalette.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(17),
    lineHeight: scale(22),
    fontWeight: '400',
    color: primaryPalette.light,
  },

  inputWrapperStyle: {
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
  },
  inputStyle: {
    flex: 1,
    marginVertical: scale(10),
    height: scale(40),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(21),
  },
  iconPersonImg: {
    width: scale(18),
    height: scale(18),
  },
  iconCardImg: {
    width: scale(21),
    height: scale(21),
  },
  iconPinImg: {
    width: scale(21),
    height: scale(21),
  },
  iconDollarImg: {
    width: scale(16),
    height: scale(16),
  },
  fieldLabel: {
    marginTop: scale(20),
    fontWeight: '300',
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(18),
    lineHeight: scale(28),
  },
});

const RenderHeader: React.FC<{ navigation: INavigation['navigation'] }> = ({
  navigation,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.goBack();
          // const navState: ProfilePropsNavigationState = {
          //   type: 'edit-profile'
          // }
          // navigation.navigate('ProfileForm', navState);
        }}
        style={styles.headerBackBtn}>
        <Image
          source={backImg}
          resizeMode="contain"
          style={styles.headerBackImg}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Change Password</Text>
    </View>
  );
};

interface FieldProps extends INavigation, Partial<TextInputProps> {
  setLoading?: (bool: boolean) => void;
  refInput?: RefObject<TextInput>;
  validateField?: (param: string) => boolean;
}

const RenderOldPassword: React.FC<FieldProps> = ({
  onSubmitEditing,
  validateField,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return !validateField?.(props_);
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        autoFocus: true,
        placeholder: 'Old Password',
        secureTextEntry: true,
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          const newCurrentForm: ChangePasswordCurrentForm = {
            ...currentFormSel<ChangePasswordCurrentForm>(),
            old_password: text,
          };
          setCurrentForm(newCurrentForm);
          setValue(text);
        },
        value,
      }}
    />
  );
};

const RenderPassword1: React.FC<FieldProps> = ({
  onSubmitEditing,
  validateField,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return !validateField?.(props_);
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'New Password',
        secureTextEntry: true,
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          const newCurrentForm: ChangePasswordCurrentForm = {
            ...currentFormSel<ChangePasswordCurrentForm>(),
            new_password: text,
          };
          setCurrentForm(newCurrentForm);
          setValue(text);
        },
        value,
      }}
    />
  );
};

const RenderPassword2: React.FC<FieldProps> = ({
  onSubmitEditing,
  validateField,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return !validateField?.(props_);
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'Confirm New Password',
        secureTextEntry: true,
        returnKeyType: 'done',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          const newCurrentForm: ChangePasswordCurrentForm = {
            ...currentFormSel<ChangePasswordCurrentForm>(),
            confirm_password: text,
          };
          setCurrentForm(newCurrentForm);
          setValue(text);
        },
        value,
      }}
    />
  );
};

type PreferencesProps = INavigation<{}>;

interface ChangePasswordCurrentForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword: React.FC<PreferencesProps> = props => {
  const { navigation } = props;
  const [, setCurrentForm] = useGlobal('currentForm');
  const [loading, setLoading] = useState<boolean>(false);
  const refPassword1 = useRef<TextInput>(null);
  const refPassword2 = useRef<TextInput>(null);

  const validateOldPassword: <P>(p: P) => boolean = (p: any) => {
    return p?.length > 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword1: <P>(p: P) => boolean = (p: any) => {
    return p?.length > 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword2: <P>(p: P) => boolean = (p: any) => {
    return (
      p?.length > 0 &&
      p === currentFormSel<ChangePasswordCurrentForm>().new_password
    );
  };

  useEffect(() => {
    setCurrentForm({});
  }, []);

  const onSubmit = async (): Promise<void> => {
    const formData = currentFormSel<ChangePasswordCurrentForm>();

    try {
      if (
        validateOldPassword(formData.old_password) &&
        validatePassword1(formData.new_password) &&
        validatePassword2(formData.confirm_password)
      ) {
        setLoading(true);
        const res = await changePasswordPOST({
          data: {
            old_password: formData.old_password,
            new_password1: formData.new_password,
            new_password2: formData.confirm_password,
          },
        });

        if (res) {
          const msg = res?.detail ? res.detail : 'New password has been saved.';

          Alert.alert(
            '',
            msg,
            [
              {
                text: 'OK',
                onPress: (): void => {
                  setLoading(false);
                  navigation.goBack();
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          setLoading(false);
        }
      }
    } catch (e) {
      const msg = getDjangoModelErrorMessage(e);
      console.log('changePasswordPOST e', msg, e);
      Alert.alert(
        '',
        msg,
        [
          {
            text: 'OK',
            onPress: (): void => {
              setLoading(false);
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Modal isVisible={loading}>
        <ActivityIndicator />
      </Modal>
      <RenderHeader navigation={navigation} />
      {/* <Text style={styles.h4}>Send me a check</Text> */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.body}>
        <RenderOldPassword
          // refInput={refSSN}
          validateField={validateOldPassword}
          {...props}
          onSubmitEditing={(): void => {
            refPassword1?.current?.focus?.();
          }}
        />

        <RenderPassword1
          refInput={refPassword1}
          validateField={validatePassword1}
          {...props}
          onSubmitEditing={(): void => {
            refPassword2?.current?.focus?.();
          }}
        />

        <RenderPassword2
          refInput={refPassword2}
          validateField={validatePassword2}
          {...props}
          onSubmitEditing={(): void => {
            onSubmit();
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            {/* {
              loading ?
                <ActivityIndicator color={primaryPalette.light} /> : */}
            <Text style={styles.submitBtnText}>Submit</Text>
            {/* } */}
          </TouchableOpacity>
        </View>
        <Divider size={20} />
      </KeyboardAwareScrollView>
    </View>
  );
};

ChangePassword.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default ChangePassword;
