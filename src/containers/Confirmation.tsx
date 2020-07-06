import React from 'react';

import {
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import titleColoredImg from '../assets/images/title-colored.png';
import confirmationSection1Img from '../assets/images/confirmation-thank-you.png';
import confirmationSection2Img from '../assets/images/confirmation-footer.png';

import { scale, getStatusBarHeight, getCurrentSession } from '../utils';
import { INavigation } from '../..';
import { useGlobal } from 'reactn';

interface ConfirmationStyles {
  wrapper: ViewStyle;
  headerWrapper: ViewStyle;
  headerImg: ImageStyle;
  section1: ViewStyle;
  section2: ViewStyle;
  section1Img: ImageStyle;
  section2Img: ImageStyle;
}

const styles = StyleSheet.create<ConfirmationStyles>({
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    marginTop: getStatusBarHeight(true),
    flexDirection: 'row',
    justifyContent: 'center',
    height: scale(180),
  },
  headerImg: {
    width: scale(160),
  },
  section1: {
    height: scale(330),
    flexDirection: 'row',
    // alignItems: 'flex-start',
    justifyContent: 'center',
  },
  section2: {
    height: scale(320),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section1Img: {
    height: scale(320),
    // width: scale(160)
  },
  section2Img: {
    height: scale(110),
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

const Confirmation: React.FC<INavigation> = ({ navigation }) => {
  const [, setUserData] = useGlobal('currentUser');

  return (
    <ScrollView style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={(): void => {
          getCurrentSession(setUserData);
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
          <Image
            resizeMode="contain"
            source={confirmationSection2Img}
            style={styles.section2Img}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Confirmation;
