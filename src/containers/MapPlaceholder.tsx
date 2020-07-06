/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'reactn';
import { View, ImageBackground } from 'react-native';
// import MainNavigator from './src/navigators/MainNavigator';
import { CustomHeader } from '../navigators/HomeNavigator';

import { PlaceholderMedia } from 'rn-placeholder';
// use this, instead of redux

import imgMapPlaceholder from '../assets/images/map-loading-placeholder.png';
import { scale } from '../utils';

const MapPlaceholder: React.FC<{ loadingSplash: boolean }> = ({
  loadingSplash,
}) => {
  const random100200_1 = Math.round(Math.random() * 100 + Math.random() * 100),
    random100200_2 = Math.round(Math.random() * 100 + Math.random() * 100),
    random100200_3 = Math.round(Math.random() * 100 + Math.random() * 100);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      <CustomHeader spinning={loadingSplash} navigation={{ state: {} }} />
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ width: '90%', marginLeft: '5%' }}>
        <View style={{ height: scale(20) }} />
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: scale(30),
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <PlaceholderMedia style={{ width: '30%', marginHorizontal: '5%' }} />
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <PlaceholderMedia style={{ width: '30%', marginHorizontal: '5%' }} />
        </View>
      </View>
      <ImageBackground
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
        // eslint-disable-next-line react-native/no-inline-styles
        imageStyle={{
          height: '100%',
          width: '100%',
          marginTop: scale(20),
          marginBottom: scale(30),
          opacity: 0.35,
        }}
        resizeMode="stretch"
        source={imgMapPlaceholder}>
        <View style={{ height: scale(20) }} />
        <PlaceholderMedia
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            opacity: 0.7,
            marginLeft: random100200_1,
            height: random100200_2,
            width: random100200_3,
          }}
        />
        <PlaceholderMedia
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            opacity: 0.6,
            marginLeft: random100200_1,
            height: random100200_2,
            width: random100200_3,
          }}
        />
        <PlaceholderMedia
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            opacity: 0.4,
            marginLeft: random100200_1,
            height: random100200_2,
            width: random100200_3,
          }}
        />
        <PlaceholderMedia
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            opacity: 0.5,
            marginLeft: random100200_1,
            height: random100200_2,
            width: random100200_3,
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default MapPlaceholder;
