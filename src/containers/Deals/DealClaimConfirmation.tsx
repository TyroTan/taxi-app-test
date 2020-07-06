import React from 'react';

import {
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import titleColoredImg from '../../assets/images/title-colored.png';
import confirmationSection1Img from '../../assets/images/confirmation-thank-you.png';

import {
  scale,
  getStatusBarHeight,
  primaryPalette,
  isIphoneScreenWidthSmall,
} from '../../utils';
import { INavigation, CheckResponse, CheckPostData } from '../../..';
import { NavigationStackOptions } from 'react-navigation-stack';

interface ConfirmationStyles {
  wrapper: ViewStyle;
  headerWrapper: ViewStyle;
  headerImg: ImageStyle;
  section1: ViewStyle;
  section2: ViewStyle;
  section1Img: ImageStyle;
  section2Img: ImageStyle;

  congratsText: TextStyle;
  p1: TextStyle;

  section3: ViewStyle;
  section3Left: ViewStyle;
  totalValue: TextStyle;
  section3Right: ViewStyle;
  h4: TextStyle;
  footer: ViewStyle;
  moreDealsBtn: ViewStyle;
  moreDealsBtnText: TextStyle;
}

const styles = StyleSheet.create<ConfirmationStyles>({
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    marginTop: getStatusBarHeight(true),
    flexDirection: 'row',
    justifyContent: 'center',
    height: scale(140),
  },
  headerImg: {
    width: scale(160),
  },
  section1: {
    height: scale(210),
    flexDirection: 'row',
    // alignItems: 'flex-start',
    justifyContent: 'center',
  },
  section2: {
    height: scale(220),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  section1Img: {
    height: scale(220),
    // width: scale(160)
  },
  section2Img: {
    height: scale(110),
  },
  congratsText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(32),
    lineHeight: scale(44),
    fontWeight: '600',
    color: primaryPalette.dark,
  },
  p1: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.dark,
    marginVertical: scale(5),
  },
  section3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: scale(90),
    paddingHorizontal: isIphoneScreenWidthSmall() ? scale(20) : scale(30),
  },
  section3Left: {
    flexDirection: 'column',
    width: '50%',
  },
  section3Right: {
    flexDirection: 'column',
    width: '50%',
  },
  totalValue: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    color: primaryPalette.orange,
    fontWeight: '500',
    fontSize: scale(24),
    lineHeight: scale(32),
  },
  h4: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontWeight: '300',
    fontSize: scale(18),
    lineHeight: scale(24),
  },
  footer: {
    marginTop: scale(20),
    height: scale(90),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  moreDealsBtn: {
    height: scale(34),
    width: '50%',
    borderWidth: 2,
    borderColor: primaryPalette.blue,
    borderRadius: scale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreDealsBtnText: {
    fontFamily: 'Avenir',
    color: primaryPalette.blue,
    fontWeight: '300',
    fontSize: scale(16),
    lineHeight: scale(22),
  },
});

const RenderHeader: React.FC = () => {
  return (
    <View style={styles.headerWrapper}>
      <Image
        resizeMode="contain"
        style={styles.headerImg}
        source={titleColoredImg}
      />
    </View>
  );
};

const DealClaimConfirmation: React.FC<INavigation<{
  postData: CheckPostData;
  response: CheckResponse;
}>> = ({ navigation }) => {
  // const postData = navigation.getParam('postData');
  const response = navigation.getParam('response');

  // const [, setUserData] = useGlobal('currentUser');

  const congratulationText = `Congratulation you get $${response?.discount_amount ??
    '0'} Dollarback`;

  return (
    <ScrollView style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={(): void => {
          // navigation.navigate('Home');
        }}>
        <RenderHeader />
        <View style={styles.section1}>
          <Image
            resizeMode="contain"
            source={confirmationSection1Img}
            style={styles.section1Img}
          />
        </View>
        <View style={styles.section2}>
          <Text style={styles.congratsText}>{congratulationText}</Text>
          <Text style={styles.p1}>We will review your summation,</Text>
          <Text style={styles.p1}>
            you will receive a notification once approved.
          </Text>
          {/* <Image resizeMode='contain' source={confirmationSection2Img} style={styles.section2Img} /> */}
        </View>
        <View style={styles.section3}>
          <View style={styles.section3Left}>
            <Text style={styles.h4}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ${response?.total_amount ?? '0'}
            </Text>
          </View>
          <View style={styles.section3Right}>
            <Text style={styles.h4}>Total Refund</Text>
            <Text style={styles.totalValue}>
              ${response?.discount_amount ?? '0'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={(): void => {
            navigation.navigate('Home');
          }}
          style={styles.moreDealsBtn}>
          <Text style={styles.moreDealsBtnText}>Get More Deals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

DealClaimConfirmation.navigationOptions = (): NavigationStackOptions => ({
  header: null,
});

export default DealClaimConfirmation;
