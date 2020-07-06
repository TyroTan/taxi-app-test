import React, { useEffect, useState, RefObject } from 'react';
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
  Platform,
} from 'react-native';
import { AsYouType } from 'libphonenumber-js';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getDjangoModelErrorMessage,
  getPermissionAsync,
  setCurrentSession,
  getCurrentSession,
  formatUSPhone,
} from '../utils';
import backImg from '../assets/images/back-black.png';
import iconPhoneCall from '../assets/images/icon-call.png';
import iconInfo from '../assets/images/icon-information.png';
import imgSilhouetteBlue from '../assets/images/icon-silhouette-blue.png';
import imgPadlock from '../assets/images/icon-padlock.png';
import { Divider, TextInputIconXL } from '../commons/components';
import { INavigation } from '../..';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGlobal } from 'reactn';
import { getUserSessionSel } from '../state_manager/selectors';
import { profilePATCH } from '../services/backend';
import { PERMISSIONS } from 'react-native-permissions';
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
      <Text style={styles.headerTitle}>Preferences</Text>
    </View>
  );
};

const RenderIconPhone: React.FC = () => {
  return (
    <Image
      resizeMode="contain"
      source={iconPhoneCall}
      style={{ width: scale(19), height: scale(19) }}
    />
  );
};

const RenderIconInfo: React.FC = () => {
  return (
    <Image
      resizeMode="contain"
      source={iconInfo}
      style={{ width: scale(19), height: scale(19) }}
    />
  );
};

const RenderIconProfile: React.FC = () => {
  return (
    <Image
      resizeMode="contain"
      source={imgSilhouetteBlue}
      style={{ width: scale(19), height: scale(19) }}
    />
  );
};

const RenderIconPadlock: React.FC = () => {
  return (
    <Image
      resizeMode="contain"
      source={imgPadlock}
      style={{ width: scale(19), height: scale(19) }}
    />
  );
};

interface CashOutForm {
  firstName: string;
  lastName: string;
  ssn: string;
  address: string;
  state: string;
}

interface FieldProps extends INavigation, Partial<TextInputProps> {
  setLoading?: (bool: boolean) => void;
  refInput?: RefObject<TextInput>;
  validateField?: (param: string) => boolean;
}

const RenderPhoneNumber: React.FC<FieldProps> = ({
  onSubmitEditing,
  // validateField,
  refInput,
  navigation,
}) => {
  const { user } = getUserSessionSel();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentForm] = useGlobal('currentForm');

  const formattedInitial = new AsYouType('US').input(user.phone_number ?? '');
  const [value, setValue] = useState(formattedInitial.replace(/[^\d+ ]/g, ''));

  useEffect(() => {
    const didFocusSub = navigation.addListener('didFocus', (): void => {
      const { user: updatedUser } = getUserSessionSel();
      if (value !== updatedUser.phone_number) {
        setValue(updatedUser.phone_number);
      }
    });

    return (): void => {
      didFocusSub.remove();
    };
    // const formatted = new AsYouType('US').input(user.phone_number);
    // setValue(formatted.replace(/[^\d\+ ]/g, ''));
  }, []);

  return (
    <TextInputIconXL
      // rightElementCondition={(props: any): boolean => {
      //   return props.length === 0;
      // }}
      // rightElementCondition={(props: any): boolean => {
      //   return true
      // }}
      // eslint-disable-next-line react-native/no-inline-styles
      wrapperStyle={{ width: '90%' }}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        // placeholder: 'XXX-XXX-XXXX',
        placeholder: value,
        returnKeyType: 'next',
        keyboardType: 'phone-pad',
        editable: false,
        onSubmitEditing,
        onChangeText: (text): void => {
          // setCurrentForm({
          //   ...currentFormSel(),
          //   phonenumber: text
          // });
          // const formatted2 = new AsYouType('US').input(text);
          // setValue(formatted2.replace(/[^\d+ ]/g, ''));
          const PREVIOUS_VALUE = '';
          const formatted = formatUSPhone(text, PREVIOUS_VALUE);
          setValue(formatted);
        },
        value: value,
      }}
    />
  );
};

const RenderChangeProfile: React.FC<FieldProps> = ({
  navigation,
  setLoading,
}) => {
  const [, setCurrentUser] = useGlobal('currentUser');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentForm] = useGlobal('currentForm');
  // const [value, setValue] = useState('');

  const onSubmitEditProfile = async (
    image: ImagePickerResponse,
  ): Promise<void> => {
    try {
      // setLoadingNewProfile(true);
      setLoading?.(true);
      const currentSession = getUserSessionSel();
      const res = await profilePATCH({
        data: {
          id: currentSession.user.id,
          image: {
            ...image,
            uri: image.uri,
          } as ImagePickerResponse,
        },
      });

      if (res && res.image) {
        const imageUri = `${res.image}?ts=${Math.round(Math.random() * 10000)}`;
        await setCurrentSession({
          ...currentSession,
          user: {
            ...currentSession.user,
            image: imageUri,
          },
        });
        await getCurrentSession(setCurrentUser);
      }
    } catch (e) {
      console.log('onSubmitEditProfile e', e);
      const msg = getDjangoModelErrorMessage(e);
      Alert.alert(msg);
    }

    navigation.goBack();

    // setLoadingNewProfile(false);
  };

  const onPressEditProfile = async (): Promise<void> => {
    try {
      const result = await getPermissionAsync({
        type:
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            : PERMISSIONS.IOS.PHOTO_LIBRARY,
      });
      // console.log('resultresult', result);
      if (result !== 'granted') {
        Alert.alert(
          'Missing Photo Library Permission',
          'Please allow access to photos in app settings to make this work.',
        );
        return;
      }
    } catch (e) {
      Alert.alert('Cannot process the request for now.');
      console.log('pickImage: ', e);
      return;
    }

    try {
      ImagePicker.launchImageLibrary(
        {
          quality: 0.3,
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        },
        response => {
          if (response.didCancel) {
            // console.log('User cancelled image picker');
          } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton);
          } else {
            const limit1MB = 1024 * 1024 * 1;
            if (response.fileSize > limit1MB) {
              Alert.alert(
                'File is too large',
                'Please choose another image with size less than 1MB.',
              );
              return;
            }

            onSubmitEditProfile(response);
          }
        },
      );
    } catch (e) {
      console.log('imagePicker e', e);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressEditProfile}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.inputWrapperStyle,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingVertical: scale(18),
          fontWeight: '300',
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(18),
          lineHeight: scale(28),
        }}>
        Change Profile Image
      </Text>
      <RenderIconProfile />
    </TouchableOpacity>
  );
};

const RenderChangePassword: React.FC<FieldProps> = ({ navigation }) => {
  return (
    <TouchableOpacity
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={(): void => {
        navigation.navigate('ChangePassword');
      }}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingVertical: scale(18),
          fontWeight: '300',
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(18),
          lineHeight: scale(28),
        }}>
        Change Password
      </Text>
      <RenderIconPadlock />
    </TouchableOpacity>
  );
};

const RenderHelpCenter: React.FC<FieldProps> = () => {
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [, setCurrentForm] = useGlobal('currentForm');
  // const [value, setValue] = useState('');

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.inputWrapperStyle,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          paddingVertical: scale(15),
          fontWeight: '300',
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(18),
          lineHeight: scale(28),
        }}>
        Help Center
      </Text>
      <RenderIconInfo />
    </View>
  );
};

type PreferencesProps = INavigation<{}>;

const Preferences: React.FC<PreferencesProps> = props => {
  const { navigation } = props;
  const [, setCurrentForm] = useGlobal('currentForm');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurrentForm({});
  }, []);

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
        <TouchableOpacity
          onPress={(): void => {
            navigation.navigate('ChangePhone', {
              state: {
                profileType: 'edit-profile',
              },
            });
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.inputWrapperStyle, { flexDirection: 'row' }]}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{ flexDirection: 'column', width: '90%' }}>
            <Text style={styles.fieldLabel}>Change Phone Number</Text>
            <RenderPhoneNumber
              autoFocus
              navigation={navigation}
              // validateField={validateName}
              // {...props}
              // onSubmitEditing={(): void => {
              //   refLastName?.current?.focus?.()
              // }}
            />
          </View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <RenderIconPhone />
          </View>
        </TouchableOpacity>
        <RenderHelpCenter navigation={navigation} />
        <RenderChangeProfile setLoading={setLoading} navigation={navigation} />
        <RenderChangePassword navigation={navigation} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn}>
            {/* {
              loading ?
                <ActivityIndicator color={primaryPalette.light} /> : */}
            <Text style={styles.submitBtnText}>Delete Account</Text>
            {/* } */}
          </TouchableOpacity>
        </View>
        <Divider size={20} />
      </KeyboardAwareScrollView>
    </View>
  );
};

Preferences.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default Preferences;
