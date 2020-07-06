import {
  createStackNavigator,
  NavigationStackOptions,
} from 'react-navigation-stack';

import LoginAdmin from '../containers/LoginAdmin';
import Signup from '../containers/Signup';
import ForgotPassword from '../containers/ForgotPassword';
import VerifyAccount from '../containers/VerifyAccount';
import VerificationCode from '../containers/VerificationCode';
import ProfileForm from '../commons/components/ProfileForm';
import Confirmation from '../containers/Confirmation';
import TermsAndAgreement from '../containers/TermsAndAgreement';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const AuthSwitch = createSwitchNavigator(
  {
    LoginAdmin: createStackNavigator(
      {
        LoginAdmin,
        ForgotPassword,
      },
      {
        // initialRouteName: 'ForgotPassword',
        defaultNavigationOptions: () => ({
          header: null,
        }),
      },
    ),
    Confirmation,
    TermsAndAgreement,
    SignupStack: createStackNavigator(
      {
        Signup,
        ForgotPassword,
        ProfileForm: {
          screen: ProfileForm,
          // navigationOptions: profileHeaderNavOptions
        },
        VerifyAccount: {
          screen: VerifyAccount,
        },
        VerificationCode: VerificationCode,
      },
      {
        // initialRouteName: 'VerifyAccount',
        defaultNavigationOptions: () => ({
          header: null,
        }),
      },
    ),
  },
  {
    initialRouteName: 'SignupStack',
    defaultNavigationOptions: (): NavigationStackOptions => ({
      headerBackTitle: 'Signup',
      header: null,
    }),
    // mode: 'modal',
    // headerMode: 'none'
  },
);

export default createAppContainer(AuthSwitch);
