import { LoginManager, AccessToken } from 'react-native-fbsdk';

// import { FACEBOOK_SSO_APPID } from 'react-native-dotenv';

import { SSOResponse } from '../..';
import moment from 'moment';
import { graphRequestGetEmailAsync, emailValidator } from '.';
import { Alert } from 'react-native';
// import {defaultUser} from '../state_manager';

const onPressFacebook = async (): Promise<SSOResponse> => {
  // TODO: Login
  try {
    let tokens = await AccessToken.getCurrentAccessToken();

    // console.log('fbtokensfbtokens', tokens)

    if (tokens) {
      if (tokens.accessToken) {
        const expDate = moment(tokens.expirationTime);
        if (!moment().isAfter(expDate)) {
          // if not expired

          const email = await graphRequestGetEmailAsync();

          if (!emailValidator(email)) {
            const res = { type: 'cancel', cancelled: true };
            Alert.alert(
              'Sorry, we are not able to sign you in this time.',
              `Please check your security settings and make sure your email is publicly available.`,
            );
            return res as SSOResponse;
          }

          const res: SSOResponse = {
            type: 'success',
            ssoType: 'fb',
            jwtAccessToken: tokens.accessToken,
            idToken: '',
            refreshToken: '',
            user: {
              email,
            },
          };

          return res;
        }
      }
    }

    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      const res = { type: 'cancel', cancelled: true };
      return res as SSOResponse;
    }

    tokens = await AccessToken.getCurrentAccessToken();
    const type = tokens && tokens.accessToken ? 'success' : 'failed';

    //   if (result.isCancelled) {
    //     console.log("Login cancelled");
    //   } else {
    //     console.log(
    //       "Login success with permissions: " +
    //         result.grantedPermissions.toString()
    //     );
    //   }

    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      // const response = await fetch(
      //   `https://graph.facebook.com/me?access_token=${token}`
      // );

      const email = await graphRequestGetEmailAsync();

      if (!email) {
        const res = { type: 'cancel', cancelled: true };
        Alert.alert(
          'Sorry, we are not able to sign you in this time.',
          `Please check your security settings and make sure your email is publicly available.`,
        );
        return res as SSOResponse;
      }

      const res: SSOResponse = {
        type,
        ssoType: 'fb',
        jwtAccessToken: tokens?.accessToken ?? '',
        idToken: '',
        refreshToken: '',
        user: {
          email,
        },
      };

      return res;
    } else {
      // type === 'cancel'
      const res = { type: 'cancel', cancelled: true };
      return res as SSOResponse;
    }
  } catch (e) {
    // await setIsAuthenticatingViaApi(false);
    // let msg = 'Cannot process the request for now.';
    // if (ifCaughtHttpErrorCode === 403 && /403/.test(e.message)) {
    //   msg = 'Please use your school email address.';
    // }
    console.log('ssoFacebook.logInWithReadPermissionsAsync e:', e.message);
    throw e;
    // function(error) {
    //   console.log("Login fail with error: " + error);
    // }

    // setTimeout(() => {
    //   Alert.alert(msg);
    // }, 1250);
  }
};

export default onPressFacebook;
