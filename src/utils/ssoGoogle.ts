// import React from 'react';

import { Alert } from 'react-native';

import { GoogleSignin } from '@react-native-community/google-signin';

import { getAlertIfStringNetworkError, emailValidator } from '../utils';

import { GOOGLE_IOS_STANDALONE_CLIENT_ID } from 'react-native-dotenv';
import { SSOResponse, UserDataUser } from '../..';

GoogleSignin.configure({
  iosClientId: GOOGLE_IOS_STANDALONE_CLIENT_ID,
});

// import { GoogleUser } from 'expo-google-app-auth';
interface GoogleUser {
  email: string;
}

// import { ISSOResponse } from '../..';
// import { getAlertIfStringNetworkError } from '.';
// import ExpoConstants from 'expo-constants';

interface LogInResult {
  type: 'success' | 'cancel';
  accessToken?: string;
  idToken: string | null;
  refreshToken: string | null;
  user: GoogleUser;
}

const onPressGoogle = async (): Promise<SSOResponse> => {
  // TODO: Login
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    // console.log('tokenstokens', userInfo, tokens);

    const { idToken = '', scopes = [], user = {} } = userInfo;
    const result = {
      scopes,
      idToken,
      accessToken: tokens.accessToken,
      user,
      type: userInfo && tokens.accessToken ? 'success' : 'failed',
    };

    if (!emailValidator((user as UserDataUser)?.email ?? '')) {
      const res = { type: 'cancel', cancelled: true };
      Alert.alert(
        'Sorry, we are not able to sign you in this time.',
        `Please check your security settings and make sure your email is publicly available.`,
      );
      return res as SSOResponse;
    }

    if (result.type === 'success' || result.accessToken) {
      // setIsAuthenticatingViaApi(true);
      // ifCaughtHttpErrorCode = 403;
      const { accessToken, refreshToken } = (result as unknown) as LogInResult;

      const userSessionData = {
        type: result.type,
        ssoType: 'google',
        jwtAccessToken: accessToken,
        idToken,
        refreshToken,
        user,
      };

      // console.log(
      //   'JSON.stringify(userSessionData)',
      //   JSON.stringify(userSessionData)
      // );

      // TODO: Turn this on when not on local
      // const d = await authGoogleSignIn(idToken);
      // console.log('d', d);

      // await setCurrentSession(JSON.stringify(userSessionData));

      // navigation.navigate('RegisterPhone', {
      //   sso: 'google',
      //   userSessionData
      // });

      return userSessionData as SSOResponse;
    } else {
      const empty = { cancelled: true };
      return empty as SSOResponse;
    }
  } catch (e) {
    // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //   // user cancelled the login flow
    // } else if (error.code === statusCodes.IN_PROGRESS) {
    //   // operation (e.g. sign in) is in progress already
    // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //   // play services not available or outdated
    // } else {
    //   // some other error happened
    // }
    const networkErrorMsg = getAlertIfStringNetworkError(e?.message ?? '');
    if (networkErrorMsg) {
      Alert.alert('Network Problem', networkErrorMsg);
      const empty = { cancelled: true };
      return empty as SSOResponse;
    }

    console.log('Google.logInAsync1: ', e.message);
    if (e.message && new RegExp('user canceled').test(e.message)) {
      const empty = { cancelled: true };
      return empty as SSOResponse;
    }
    throw e;

    // setTimeout(() => {
    //   Alert.alert(msg);
    // }, 1250);
  }
};

export default onPressGoogle;
