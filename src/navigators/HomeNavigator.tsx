import React, { useState, useRef } from 'react';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import {
  createDrawerNavigator,
  NavigationDrawerScreenComponent,
} from 'react-navigation-drawer';

// import {
//   createBottomTabNavigator,
//   NavigationBottomTabOptions,
// } from 'react-navigation-tabs';
import {
  createStackNavigator,
  NavigationStackOptions,
  HeaderProps,
} from 'react-navigation-stack';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Alert,
  Platform,
  ActivityIndicator,
  ImageStyle,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import { useGlobal } from 'reactn';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import ChangePhone from '../containers/ChangePhone';
import ChangePhoneVerify from '../containers/ChangePhoneVerify';
import ChangePassword from '../containers/ChangePassword';
import bellImg from '../assets/images/icon-bell.png';
import filterImg from '../assets/images/icon-filter.png';
import cursorWhiteImg from '../assets/images/cursor-white.png';
import cursorImg from '../assets/images/cursor.png';
import bestDealImg from '../assets/images/icon-best-deal.png';
import topTabListImg from '../assets/images/top-tab-list.png';
import topTabListDarkImg from '../assets/images/top-tab-list-dark.png';
import menuImg from '../assets/images/icon-menu.png';
import imgSilhouette from '../assets/images/icon-silhouette.png';
import {
  scale,
  setCurrentSession,
  primaryPalette,
  getStatusBarHeight,
  getCaughtAxiosErrorMessage,
  isIphoneScreenWidthSmall,
  getPermissionAsync,
} from '../utils/index';
import { INavigation, HomeSwitchRouteNames } from '../..';
import { TextInputIconXL } from '../commons/components';
import { sizeM, sizeL, sizeXL, sizeX3L } from '../commons/styles';
import { WIDTH_WINDOW } from '../utils/constants';
import { isLoggedInSel, getUserSessionSel } from '../state_manager/selectors';
import { defaultEmptyCurrentUser } from '../state_manager';
import Profile from '../containers/Profile';
import DollarbackEarning from '../containers/Dollarback/DollarbackEarning';
import TrackCheck from '../containers/Dollarback/TrackCheck';
import CashOut from '../containers/Dollarback/CashOut';
import AddressAutoComplete from '../containers/Dollarback/AddressAutoComplete';
import Home from '../containers/Home';
import Plan from '../containers/Plan';
import Preferences from '../containers/Preferences';
import ProfileForm from '../commons/components/ProfileForm';
import PlaceComponent from '../containers/PlaceComponent';
import CameraReceipt from '../containers/Deals/CameraReceipt';
import DealClaimConfirmation from '../containers/Deals/DealClaimConfirmation';
import Modal from 'react-native-modal';
import { PERMISSIONS } from 'react-native-permissions';

const DUMMY_OPACITY_TO_HIDE_BELL = 0;
interface HeaderStyles {
  wrapper: ViewStyle;
  searchWrapper: ViewStyle;
  searchInput: TextStyle;
  section1Search: ViewStyle;
  section2filters: ViewStyle;
  section2foundText: TextStyle;
  section2Right: ViewStyle;
  filterWrapper: ViewStyle;
  filterBtn: ViewStyle;
  filterBtnIcon: ImageStyle;
  filterBtnText: TextStyle;
}

const searchInputHeight = scale(40);

const headerStyles = StyleSheet.create<HeaderStyles>({
  wrapper: {
    height: scale(140),
    backgroundColor: primaryPalette.orange,
    paddingTop: getStatusBarHeight(true) + scale(5),
  },
  searchWrapper: {
    backgroundColor: primaryPalette.light,
    marginLeft: scale(15),
    marginRight: scale(12),
    width: '68%',
    borderRadius: scale(30),
    paddingHorizontal: scale(10),
    height: searchInputHeight,
  },
  searchInput: {
    flex: 1,
    // paddingVertical: scale(15),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: sizeM,
    lineHeight: sizeXL,
    fontWeight: '400',
    textAlignVertical: 'center',
    paddingLeft: scale(5),
    width: '10%',
    // lineHeight: sizeL,
    // paddingVertical: scale(3)
  },
  section1Search: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section2filters: {
    marginTop: scale(15),
    marginLeft: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section2foundText: {
    width: '68%',
    fontFamily: 'Avenir',
    marginRight: scale(12),
    // textAlign: 'center',
    color: primaryPalette.light,
    fontSize: sizeL,
    lineHeight: sizeX3L,
    fontWeight: '300',
  },
  section2Right: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    // width: '30%',
    paddingRight: scale(16),
  },
  filterWrapper: {
    marginLeft: '10%',
    width: '80%',
    padding: scale(20),
    // height: scale(200),
    backgroundColor: primaryPalette.light,
    flexDirection: 'column',
  },
  filterBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: scale(5),
    marginLeft: scale(5),
  },
  filterBtnIcon: {
    width: scale(13),
    height: scale(13),
  },
  filterBtnText: {
    flex: 1,
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(24),
    paddingLeft: scale(15),
    fontWeight: '700',
  },
});

const IconComponentSearch: React.FC = () => (
  <IconFontAwesome name="search" size={scale(17)} />
);

const stylesTab = StyleSheet.create({
  wrapper: {
    marginTop: scale(10),
    height: scale(70),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(120),
    padding: scale(10),
    backgroundColor: primaryPalette.light,

    elevation: 2,
    shadowColor: '#a0a0a0',
    shadowOffset: {
      width: -1,
      height: 0,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  btnLeft: {
    borderTopLeftRadius: scale(25),
    borderBottomLeftRadius: scale(25),
  },
  btnRight: {
    borderTopRightRadius: scale(25),
    borderBottomRightRadius: scale(25),
  },
  btnActiveLeft: {
    backgroundColor: primaryPalette.orange,
  },
  btnActiveRight: {
    backgroundColor: primaryPalette.orange,
  },
  btnText: {
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '400',
  },
  btnTextActive: {
    color: primaryPalette.light,
  },
  img: {
    width: scale(14),
    height: scale(14),
    marginRight: scale(5),
  },
});

const RenderHomeTopTab: React.FC<INavigation> = ({ navigation }) => {
  const index = navigation?.state?.index ?? 0;
  const routes = navigation?.state?.routes ?? [];
  const childIndex = routes?.[index]?.index ?? 0;
  const childRoutes = routes?.[index]?.routes ?? [];

  const routeName = childRoutes[childIndex]?.routeName as HomeSwitchRouteNames;

  return (
    <View style={stylesTab.wrapper}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('HomeMap');
        }}
        style={[
          stylesTab.btn,
          stylesTab.btnLeft,
          routeName === 'HomeMap' ? stylesTab.btnActiveLeft : {},
        ]}>
        <Image
          source={routeName === 'HomeMap' ? cursorWhiteImg : cursorImg}
          style={stylesTab.img}
          resizeMode="contain"
        />
        <Text
          style={[
            stylesTab.btnText,
            routeName === 'HomeMap' ? stylesTab.btnTextActive : {},
          ]}>
          Map
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('PlaceList');
        }}
        style={[
          stylesTab.btn,
          stylesTab.btnRight,
          routeName === 'PlaceList' ? stylesTab.btnActiveRight : {},
        ]}>
        <Image
          source={routeName === 'PlaceList' ? topTabListImg : topTabListDarkImg}
          style={stylesTab.img}
          resizeMode="contain"
        />
        <Text
          style={[
            stylesTab.btnText,
            routeName === 'PlaceList' ? stylesTab.btnTextActive : {},
          ]}>
          List
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CustomHeader: React.FC<INavigation> = (props): React.ReactElement => {
  const { navigation } = props;
  const [, setCurrentForm] = useGlobal('currentForm');
  const [, setCurrentFilter] = useGlobal('currentFilter');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const currentUser = getUserSessionSel().user;
  const [isFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const searchText = (navigation?.state?.routes ?? [])?.[0]?.routes?.[0]?.params?.searchText;
  const refSearchText = useRef<TextInput>(null);
  const { routeName } = navigation.state?.routes?.[navigation.state?.index] ?? {
    routeName: '',
  };
  const bgColor =
    routeName === 'Profile' ? primaryPalette.blue : primaryPalette.orange;

  // const headerBtn = `< here ya`;
  return (
    <TouchableWithoutFeedback
      onPress={(): void => {
        Keyboard.dismiss();
      }}>
      <View style={[headerStyles.wrapper, { backgroundColor: bgColor }]}>
        <View style={headerStyles.section1Search}>
          <TextInputIconXL
            isValid={isFormValid}
            wrapperStyle={headerStyles.searchWrapper}
            textInputProps={{
              ref: refSearchText,
              style: headerStyles.searchInput,
              placeholder: 'Search store...',
              placeholderTextColor: '#d8d8d8',
              returnKeyType: 'next',
              // autoCompleteType: 'email',
              // keyboardType: 'email-address',
              onChangeText: (text: string): void => {
                navigation.setParams({
                  searchText: text.toLowerCase(),
                });
                setCurrentForm({
                  searchText: text.toLowerCase(),
                });

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
              // value: searchText,
              onSubmitEditing: async (): Promise<void> => {
                refSearchText?.current?.blur?.();

                // navigation.navigate('PlaceList');

                // if (refPassword.current) {
                //   ((refPassword.current || {}) as TextInput).focus();
                // }
              },
            }}
            rightElement={(): JSX.Element => {
              return (
                <TouchableOpacity
                  onPress={(): void => {
                    // refSearchText?.current?.blur?.();
                    // navigation.navigate('PlaceList');
                  }}>
                  <IconComponentSearch />
                </TouchableOpacity>
              );
            }}
          />
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: '30%',
              height: searchInputHeight,
              paddingRight: scale(10),
            }}>
            <Image
              source={bellImg}
              style={{
                opacity: DUMMY_OPACITY_TO_HIDE_BELL,
                width: scale(19),
                height: scale(19),
              }}
            />
            <TouchableOpacity
              onPress={(): void => {
                if (props.spinning) return;
                navigation.navigate('Profile');
              }}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: scale(10),
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
                overflow: 'hidden',
              }}>
              {props.spinning === true ? (
                <ActivityIndicator />
              ) : currentUser?.image?.length ? (
                <Image
                  source={{ uri: currentUser.image }}
                  style={{ width: scale(40), height: scale(40) }}
                />
              ) : (
                <Image
                  source={imgSilhouette}
                  resizeMode="contain"
                  style={{ width: scale(40) }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={headerStyles.section2filters}>
          <Text style={headerStyles.section2foundText}>
            {/* We found 4 deals for you */}
          </Text>
          <View style={headerStyles.section2Right}>
            <Modal isVisible={isFilterModalOpen}>
              <View style={headerStyles.filterWrapper}>
                <TouchableOpacity
                  style={headerStyles.filterBtn}
                  onPress={async (): Promise<void> => {
                    let hadPermission = false;

                    if (Platform.OS === 'android') {
                      hadPermission =
                        (await getPermissionAsync({
                          type: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                        })) === 'granted';
                    } else {
                      hadPermission =
                        (await getPermissionAsync({
                          type: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                        })) === 'granted';
                    }

                    if (!hadPermission) {
                      Alert.alert(
                        'Missing location services permission.',
                        'Location services need to be activated in order for sort by closest to work',
                        [
                          {
                            text: 'OK',
                            onPress: (): void => {
                              setIsFilterModalOpen(false);
                            },
                          },
                        ],
                        { cancelable: false },
                      );
                      return;
                    }

                    setCurrentFilter('near-me');
                    setIsFilterModalOpen(false);
                  }}>
                  <Image
                    source={cursorImg}
                    resizeMode="contain"
                    style={headerStyles.filterBtnIcon}
                  />
                  <Text style={headerStyles.filterBtnText}>Near Me</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={headerStyles.filterBtn}
                  onPress={(): void => {
                    setCurrentFilter('best-deals');
                    setIsFilterModalOpen(false);
                  }}>
                  <Image
                    source={bestDealImg}
                    resizeMode="contain"
                    style={[
                      headerStyles.filterBtnIcon,
                      { height: scale(16), width: scale(16) },
                    ]}
                  />
                  <Text style={headerStyles.filterBtnText}>Best Deals</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* this is just a dummy el for flex */}
            <Image
              source={filterImg}
              // style={{ width: scale(27), height: scale(27), marginLeft: scale(15) }}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginLeft: scale(15),
                width: scale(27),
                height: scale(27),
                opacity: 0,
              }}
            />

            <TouchableOpacity
              onPress={(): void => {
                setIsFilterModalOpen(true);
              }}>
              <Image
                source={menuImg}
                style={{ width: scale(27), height: scale(27) }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {routeName === 'Home' ? <RenderHomeTopTab {...props} /> : <></>}
      </View>
    </TouchableWithoutFeedback>
  );
};

interface StylesDrawerItems {
  wrapper: ViewStyle;
  btn: ViewStyle;
  btnText: TextStyle;
}

const stylesDrawerItems = StyleSheet.create<StylesDrawerItems>({
  wrapper: { flex: 1, backgroundColor: '#FFF' },
  btn: {
    // borderWidth: 1,
    // borderColor: 'black',
    // height: scale(45),
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Avenir',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: scale(isIphoneScreenWidthSmall() ? 23 : 26),
    color: primaryPalette.dark,
    paddingRight: scale(32),
    // borderColor: 'green',
    // borderWidth: 1,
    width: WIDTH_WINDOW * 0.5,
  },
});

// somehow tabBarComponent isn't working well on android
const materialTopTabConfig =
  Platform.OS === 'android'
    ? {}
    : {
        // so that CustomHeader prevails
        // eslint-disable-next-line react/display-name
        tabBarComponent: (): JSX.Element => <></>,
      };

const HomeStack = createStackNavigator(
  {
    Home: createMaterialTopTabNavigator({
      HomeMap: Home,
      PlaceList: Home,
    }),
    PlaceComponent,
    Plan,
    CameraReceipt,
    DealClaimConfirmation,
    Profile: createStackNavigator(
      {
        Profile,
        Preferences,
        ProfileForm,
        TrackCheck,
        DollarbackEarning,
        CashOut,
        AddressAutoComplete,
        ChangePhone,
        ChangePhoneVerify,
        ChangePassword,
      },
      {
        navigationOptions: () => ({
          header: null,
        }),
      },
    ),
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: (props): NavigationStackOptions => {
      // const setSearchText = props.navigation.getParam('setSearchText');
      // const searchText = props.navigation.getParam('searchText');
      // const {screenProps} = props;

      // if (screenProps.currentOrientationInfo as OrientationInfo) {
      //   if (screenProps.currentOrientationInfo.orientation === 'LANDSCAPE') {
      //     return {
      //       header: null,
      //     };
      //   }
      // }

      const LoginHeader = (loginHeaderProps: HeaderProps): JSX.Element => (
        <CustomHeader {...{ ...props, ...loginHeaderProps }} />
      );

      return {
        header: LoginHeader,
      };
    },
  },
);

// const AuthStack = createBottomTabNavigator(
//   {
//     HomeStack: HomeStack,
//   },
//   {
//     initialRouteName: 'HomeStack'
//   },
// );

const CustomDrawerContentComponent = (props: INavigation): JSX.Element => {
  const [, setCurrentUser] = useGlobal('currentUser');
  // const {navigation} = props;

  const loginLogoutText = isLoggedInSel() ? 'LOGOUT' : 'LOGIN';

  const onLogout = async (): Promise<void> => {
    try {
      // await logoutGET();
      setCurrentSession('');
      setCurrentUser(defaultEmptyCurrentUser);
      // navigation.navigate('Login');
    } catch (e) {
      setCurrentSession('');
      setCurrentUser(defaultEmptyCurrentUser);
      // navigation.navigate('Login');
      console.log('logout e', getCaughtAxiosErrorMessage(e), e);
    }
  };

  return (
    <SafeAreaView style={stylesDrawerItems.wrapper}>
      <TouchableOpacity
        style={stylesDrawerItems.btn}
        onPress={(): void => {
          // if (isLoggedInSel()) {
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
          // } else {
          //   navigation.navigate('Login');
          // }
        }}>
        <Text numberOfLines={2} style={stylesDrawerItems.btnText}>
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const navigationDrawerScreenConf: Partial<NavigationDrawerScreenComponent> = {
  // gestureEnabled: false, // we simply disable drawer for now
  drawerWidth: WIDTH_WINDOW * 0.85,
  contentComponent: CustomDrawerContentComponent,
  drawerBackgroundColor: primaryPalette.dark,
  overlayColor: 'rgba(0, 0, 0, .6)',
  drawerPosition: 'left',
  contentOptions: {
    // itemStyle: styles.drawerContentItemStyle,
    // labelStyle: styles.drawerContentLabelStyle,
    // activeBackgroundColor: stylesUtil.primaryMainGreen,
    activeTintColor: '#000',
  },
};

// createSwitchNavigator(
//   {
//     Home: HomeStack,
//     // HomeSearchDestination: SwapHistory,
//   },
//   {
//     initialRouteName: 'Home',
//   },
// ),

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomeDrawerNav = createDrawerNavigator(
  {
    HomeStack,
  },
  (navigationDrawerScreenConf as unknown) as NavigationDrawerScreenComponent,
);

export default createAppContainer(HomeStack);
export { CustomHeader };
