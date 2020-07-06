import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import { createDrawerNavigator } from 'react-navigation-drawer';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  createStackNavigator,
  NavigationStackOptions,
} from 'react-navigation-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import LoginAdmin from '../containers/LoginAdmin';
import { scale, primaryPalette } from '../utils/index';
import { INavigation } from '../..';

// interface StylesDrawerItems {}
// const stylesDrawerItems = StyleSheet.create<StylesDrawerItems>({});

const CustomHeader: React.FC<INavigation> = ({
  navigation,
}): React.ReactElement => {
  const headerBtn = `< here ya`;
  return (
    <View
      style={{
        height: scale(220),
        backgroundColor: primaryPalette.orange,
      }}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('SignUp');
        }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ padding: 20 }}>{headerBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginStack = createStackNavigator(
  {
    LoginAdmin: {
      screen: LoginAdmin,
    },
  },
  {
    defaultNavigationOptions: (): NavigationStackOptions => {
      // const {screenProps} = props;

      // if (screenProps.currentOrientationInfo as OrientationInfo) {
      //   if (screenProps.currentOrientationInfo.orientation === 'LANDSCAPE') {
      //     return {
      //       header: null,
      //     };
      //   }
      // }

      // const LoginHeader = (props: INavigation): JSX.Element => (
      //   <CustomHeader {...props} />
      // );

      return {
        // header: LoginHeader,
      };
    },
  },
);

const AuthStack = createBottomTabNavigator(
  {
    LoginStack: LoginStack,
  },
  {
    initialRouteName: 'LoginStack',
    defaultNavigationOptions: () => ({
      tabBarVisible: false,
    }),
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthStack,
      // HomeSearchDestination: SwapHistory,
    },
    {
      initialRouteName: 'Auth',
    },
  ),
);
