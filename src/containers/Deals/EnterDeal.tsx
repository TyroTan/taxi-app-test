import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  ImageStyle,
  Image,
  TextStyle,
  ScrollView,
} from 'react-native';
import { INavigation } from '../../..';
import { getStatusBarHeight, scale, primaryPalette } from '../../utils';
import personImg from '../../assets/images/icon-person.png';
import percentImg from '../../assets/images/icon-percent.png';
import dollarImg from '../../assets/images/icon-dollar.png';
import { TextInputIconXL } from '../../commons/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface EnterDealStyles {
  wrapper: ViewStyle;
  h1: TextStyle;
  content: ViewStyle;
  h3: TextStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  personImg: ImageStyle;

  changeProfile: ViewStyle;
  changeProfileImg: ImageStyle;
  changeProfileBtn: ViewStyle;
  changeProfileBtnText: TextStyle;
}

const styles = StyleSheet.create<EnterDealStyles>({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(true),
  },
  h1: {
    color: primaryPalette.dark,
    padding: scale(20),
    fontFamily: 'Avenir',
    fontSize: scale(30),
    lineHeight: scale(38),
    fontWeight: '800',
  },
  content: {
    padding: scale(20),
  },
  h3: {
    color: primaryPalette.dark,
    padding: scale(20),
    fontFamily: 'Avenir',
    fontSize: scale(20),
    lineHeight: scale(25),
    fontWeight: '400',
  },
  inputWrapper: {
    // padding: scale(10),
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(112, 112, 112, .23)', // 707070
  },
  input: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: scale(18),
    lineHeight: scale(25),
    height: scale(60),
    flexDirection: 'row',
    paddingHorizontal: scale(15),
  },
  personImg: {
    width: scale(17),
    height: scale(17),
  },
  changeProfile: {
    // height: scale(100),
  },
  changeProfileImg: {
    marginTop: scale(20),
    height: scale(136),
    width: '100%',
  },
  changeProfileBtn: {
    alignItems: 'center',
  },
  changeProfileBtnText: {
    fontSize: scale(19),
    lineHeight: scale(25),
    padding: scale(10),
    fontWeight: '500',
    fontFamily: 'Avenir',
    color: primaryPalette.blue,
  },
});

const RenderFieldTitle: React.FC = () => {
  return (
    <TextInputIconXL
      wrapperStyle={styles.inputWrapper}
      rightElement={(): JSX.Element => <></>}
      leftIcon={(): JSX.Element => {
        return (
          <Image
            source={personImg}
            style={styles.personImg}
            resizeMode="contain"
          />
        );
      }}
      textInputProps={{
        style: styles.input,
        placeholder: 'Title',
        placeholderTextColor: '#a0a0a0',
      }}
    />
  );
};

const RenderFieldPercentage: React.FC = () => {
  return (
    <TextInputIconXL
      wrapperStyle={styles.inputWrapper}
      rightElement={(): JSX.Element => <></>}
      leftIcon={(): JSX.Element => {
        return (
          <Image
            source={percentImg}
            style={styles.personImg}
            resizeMode="contain"
          />
        );
      }}
      textInputProps={{
        style: styles.input,
        placeholder: 'Percentage',
        placeholderTextColor: '#a0a0a0',
      }}
    />
  );
};

const RenderFieldAmount: React.FC = () => {
  return (
    <TextInputIconXL
      wrapperStyle={styles.inputWrapper}
      rightElement={(): JSX.Element => <></>}
      leftIcon={(): JSX.Element => {
        return (
          <Image
            source={dollarImg}
            style={styles.personImg}
            resizeMode="contain"
          />
        );
      }}
      textInputProps={{
        style: styles.input,
        placeholder: 'Amount',
        placeholderTextColor: '#a0a0a0',
      }}
    />
  );
};

const RenderFieldChangeProfile: React.FC = () => {
  return (
    <View style={styles.changeProfile}>
      {/* Image source here */}
      <Image
        resizeMode="contain"
        source={dollarImg}
        style={styles.changeProfileImg}
      />
      <TouchableOpacity style={styles.changeProfileBtn}>
        <Text style={styles.changeProfileBtnText}>Change Profile Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const RenderForm: React.FC<INavigation> = () => {
  return (
    <ScrollView
      contentInset={{
        bottom: scale(50),
      }}>
      <KeyboardAwareScrollView
        style={styles.content}
        keyboardShouldPersistTap="handled">
        <RenderFieldTitle />
        <RenderFieldPercentage />
        <RenderFieldAmount />
        <RenderFieldChangeProfile />
        {/* <RenderFieldTitle />
        <RenderFieldPercentage />
        <RenderFieldAmount /> */}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const EnterDeal: React.FC<INavigation> = props => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.h1}>Enter Deal</Text>
      <Text style={styles.h3}>Enter Detail</Text>
      <RenderForm {...props} />
    </View>
  );
};

export default EnterDeal;
