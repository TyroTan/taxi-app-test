/* eslint-disable react/display-name */

import React, { useRef, useState, useEffect } from 'react';
import {
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
  TextInputProps,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { PERMISSIONS } from 'react-native-permissions';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import { NavigationStackOptions } from 'react-navigation-stack';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getPermissionAsync,
  getDjangoModelErrorMessage,
  setCurrentSession,
  getCurrentSession,
} from '../utils';
// import { TextInputIconXL } from '../commons/components';
import { INavigation } from '../..';
import dollarImg from '../assets/images/icon-dollar-blue.png';
import settingsImg from '../assets/images/icon-settings.png';
import backImg from '../assets/images/back.png';
import { getUserSessionSel } from '../state_manager/selectors';
import { ProgressiveImage, DividerLine } from '../commons/components';
import imgSilhouetteBlue from '../assets/images/icon-silhouette-blue.png';
import { profilePATCH } from '../services/backend';
import { useGlobal } from 'reactn';

interface ProfileStyles {
  wrapper: ViewStyle;
  searchWrapper: ViewStyle;
  searchInput: TextStyle;
}

const styles = StyleSheet.create<ProfileStyles>({
  wrapper: {
    flex: 1,
  },
  searchWrapper: {
    borderWidth: 1,
    borderColor: 'red',
  },
  searchInput: {
    paddingVertical: scale(15),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    // lineHeight: sizeL,
    // paddingVertical: scale(3)
  },
});

interface ProfileHeaderStyles {
  wrapper: ViewStyle;
  backImg: ImageStyle;
  backBtn: ViewStyle;

  nameWrapper: ViewStyle;
  userNameText: TextStyle;
  userNameShrinked: TextStyle;
  emailText: TextStyle;
  emailTextShrinked: TextStyle;
  profileBtn: ViewStyle;
  profileImg: ImageStyle;

  menuBtn: ViewStyle;
  menuIcon: ImageStyle;
  menuWrapper: ViewStyle;
  menuItem: ViewStyle;
  menuItemLogout: TextStyle;
  menuText: TextStyle;
}

const headerStyles = StyleSheet.create<ProfileHeaderStyles>({
  wrapper: {
    height: scale(140),
    backgroundColor: primaryPalette.blue,
    paddingTop: getStatusBarHeight(true) + scale(5),
    paddingHorizontal: scale(15),
    paddingRight: scale(20),
  },
  backImg: {
    height: scale(21),
    width: scale(21),
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(23),
    padding: scale(3),
    marginLeft: scale(-3),
  },
  nameWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: scale(5),
  },
  userNameText: {
    fontFamily: 'Avenir',
    fontSize: scale(28),
    lineHeight: scale(36),
    fontWeight: '800',
    color: primaryPalette.light,
  },
  userNameShrinked: {
    fontSize: scale(22),
    lineHeight: scale(28),
  },
  emailText: {
    fontFamily: 'Avenir',
    fontSize: scale(18),
    lineHeight: scale(24),
    fontWeight: '400',
    color: primaryPalette.light,
  },
  emailTextShrinked: {
    fontSize: scale(16),
    lineHeight: scale(21),
  },
  profileBtn: {
    padding: scale(3),
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(55),
    width: scale(55),
    borderRadius: scale(27),
    overflow: 'hidden',
  },
  profileImg: {
    height: scale(55),
    width: scale(55),
  },
  menuWrapper: {
    flexDirection: 'column',
    paddingHorizontal: scale(15),
  },
  menuItem: {
    height: scale(70),
    paddingRight: scale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(40),
    width: scale(40),
    padding: scale(10),
  },
  menuIcon: {
    height: scale(20),
    width: scale(20),
  },
  menuText: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: scale(19),
    lineHeight: scale(24),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  menuItemLogout: {
    height: '100%',
    width: '100%',
    padding: 0,
  },
});

// Extends FC with custom static methods
interface ComponentWithStaticMethod<TProps> extends React.FC<TProps> {
  navigationOptions: () => NavigationStackOptions;
}

const Profile: ComponentWithStaticMethod<INavigation> = ({
  navigation,
}): JSX.Element => {
  const [, setCurrentUser] = useGlobal('currentUser');

  const onLogout = async (): Promise<void> => {
    try {
      // await logoutGET();
      setCurrentSession('');
      getCurrentSession(setCurrentUser);
      // navigation.navigate('Login');
    } catch (e) {
      setCurrentSession('');
      getCurrentSession(setCurrentUser);
      // navigation.navigate('Login');
      console.log('logout e', getDjangoModelErrorMessage(e), e);
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <RenderMenus onLogout={onLogout} navigation={navigation} />
    </View>
  );
};

interface ShrinkingTextProps extends Partial<TextInputProps> {
  shrinkStyle?: TextStyle;
  shrinkThreshold: number;
}

const ShrinkingText: React.FC<ShrinkingTextProps> = props => {
  const { shrinkStyle = {}, shrinkThreshold, ...rest } = props;
  const textInputProps: TextInputProps = rest as TextInputProps;

  if (((props.children as string)?.length ?? 0) > shrinkThreshold) {
    const textInputPropsStyle = (textInputProps?.style ?? {}) as object;
    const shrinkTextInputProps = {
      ...textInputProps,
      style: {
        ...textInputPropsStyle,
        ...shrinkStyle,
      },
    };

    return <Text {...shrinkTextInputProps} />;
  }

  return <Text {...textInputProps} />;
};

interface RenderMenusProps extends INavigation {
  onLogout: () => void;
}

const RenderMenus: React.FC<RenderMenusProps> = ({
  navigation,
  onLogout,
}): React.ReactElement => {
  return (
    <View style={headerStyles.menuWrapper}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('Preferences');
        }}
        style={headerStyles.menuItem}>
        <Text style={headerStyles.menuText}>Preferences</Text>
        <Image
          source={settingsImg}
          resizeMode="contain"
          style={headerStyles.menuIcon}
        />
      </TouchableOpacity>
      <DividerLine size={1} />
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('DollarbackEarning');
        }}
        style={headerStyles.menuItem}>
        <Text style={headerStyles.menuText}>Dollarback</Text>
        <Image
          source={dollarImg}
          resizeMode="contain"
          style={headerStyles.menuIcon}
        />
      </TouchableOpacity>
      {/* <DividerLine size={1} />
      <TouchableOpacity onPress={(): void => {
        navigation.navigate('TermsAndAgreement');
      }} style={headerStyles.menuItem}>
        <Text style={headerStyles.menuText}>
          Terms And Agreement
        </Text>
        {/* <Image source={dollarImg} resizeMode='contain' style={headerStyles.menuIcon} /> * /}
      </TouchableOpacity> */}
      <DividerLine size={1} />
      <View style={headerStyles.menuItem}>
        <TouchableOpacity
          onPress={(): void => {
            Alert.alert('Are you sure you want to logout?', '', [
              {
                text: 'No',
                onPress: (): void => {
                  return;
                },
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: (): void => {
                  onLogout();
                },
              },
            ]);
          }}
          style={[headerStyles.menuBtn, headerStyles.menuItemLogout]}>
          <Text style={[headerStyles.menuText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomHeader: React.FC<INavigation> = ({
  navigation,
}): React.ReactElement => {
  const [, setCurrentUser] = useGlobal('currentUser');
  const [loadingNewProfile, setLoadingNewProfile] = useState(false);

  const { user } = getUserSessionSel();

  const timerT1 = useRef<global.setTimeout>(null);
  const timerT2 = useRef<global.setTimeout>(null);

  useEffect(() => {
    return (): void => {
      if (timerT1?.current) {
        clearInterval(timerT1?.current);
      }
      if (timerT2?.current) {
        clearInterval(timerT2?.current);
      }
    };
  }, []);

  const onSubmitEditProfile = async (
    image: ImagePickerResponse,
  ): Promise<void> => {
    try {
      setLoadingNewProfile(true);
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

    setLoadingNewProfile(false);
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

    // setLoadingCamera(true);
    // const result = {};
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   // aspect: [1, 1],
    //   aspect: [1128, 1380]
    // });
    try {
      // ImagePicker.showImagePicker(
      ImagePicker.launchImageLibrary(
        {
          quality: 0.3,
          // title: 'Choose an option below:',
          // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        },
        response => {
          // console.log('Response = ', response);

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
    <View style={headerStyles.wrapper}>
      <TouchableOpacity
        style={headerStyles.backBtn}
        onPress={(): void => {
          navigation.navigate('Home');
        }}>
        <Image
          resizeMode="contain"
          source={backImg}
          style={headerStyles.backImg}
        />
      </TouchableOpacity>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ flexDirection: 'row' }}>
        <View style={headerStyles.nameWrapper}>
          <ShrinkingText
            shrinkThreshold={15}
            numberOfLines={1}
            style={headerStyles.userNameText}
            shrinkStyle={headerStyles.userNameShrinked}>
            {user.name}
          </ShrinkingText>
          <ShrinkingText
            shrinkThreshold={30}
            numberOfLines={1}
            style={headerStyles.emailText}
            shrinkStyle={headerStyles.emailTextShrinked}>
            {user.email}
          </ShrinkingText>
        </View>
        <TouchableOpacity
          onPress={(): void => {
            onPressEditProfile();
          }}
          style={[
            headerStyles.profileBtn,
            (user?.image?.length ?? 0) > 0
              ? {}
              : { width: scale(40), height: scale(40) },
          ]}>
          {loadingNewProfile ? (
            <ActivityIndicator size="large" color={primaryPalette.light} />
          ) : user?.image?.length ? (
            <ProgressiveImage
              thumbnailSource={imgSilhouetteBlue}
              source={{ uri: user.image }}
              resizeMode="contain"
              style={headerStyles.profileImg}
            />
          ) : (
            <Image
              source={imgSilhouetteBlue}
              style={{ width: scale(40) }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

Profile.navigationOptions = (): NavigationStackOptions => {
  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    header: props => <CustomHeader {...props} />,
  };
};

export default Profile;
