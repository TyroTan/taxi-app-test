import React, { useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ImageStyle,
  Image,
  ImageBackground,
} from 'react-native';
import { INavigation, ProductIAP } from '../..';
import { scale, primaryPalette } from '../utils';
import h1Image from '../assets/images/dollarback-h1-white.png';
import bg1Img from '../assets/images/plan-bg1.png';
import bg2Img from '../assets/images/plan-bg2.png';
import Modal from 'react-native-modal';
import { productsIAPSel } from '../state_manager/selectors';
interface PlanStyles {
  wrapper: ViewStyle;
  bg1Img: ImageStyle;
  bg2Img: ImageStyle;
  h1Image: ImageStyle;
  p: TextStyle;
  btn: ViewStyle;
  btnText: TextStyle;

  iapWrapper: ViewStyle;
  iapItem: ViewStyle;
  iapLeft: ViewStyle;
  iapTitle: TextStyle;
  iapDescription: TextStyle;
  iapRight: ViewStyle;
  iapChooseBtn: ViewStyle;
  iapChooseBtnText: TextStyle;
}

type PlanProps = INavigation;

const styles = StyleSheet.create<PlanStyles>({
  wrapper: {},
  bg1Img: {
    height: scale(300),
    // width: '90%',
    // marginLeft: '-10%',
    // height: scale(300)
  },
  bg2Img: {
    height: scale(350),
    // width: '100%',
    // height: scale(300),
    // height: scale(200),
  },
  h1Image: {
    alignSelf: 'center',
    height: scale(42),
    width: scale(250),
    marginBottom: scale(20),
    marginTop: scale(30),
  },
  p: {
    color: primaryPalette.light,
    fontFamily: 'Avenir',
    fontSize: scale(18),
    lineHeight: scale(22),
    fontWeight: '300',
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },
  btn: {
    backgroundColor: primaryPalette.light,
    width: '80%',
    alignSelf: 'center',
    height: scale(55),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: primaryPalette.orange,
    fontSize: scale(18),
    lineHeight: scale(22),
    fontWeight: '400',
  },
  iapWrapper: {
    padding: scale(10),
    width: '100%',
    // marginLeft: '5%',
    backgroundColor: primaryPalette.light,
  },
  iapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: scale(10),
    padding: scale(10),
    backgroundColor: primaryPalette.blue,
    borderRadius: scale(5),
  },
  iapLeft: {
    width: '65%',
  },
  iapTitle: {
    fontFamily: 'Avenir',
    fontSize: scale(20),
    lineHeight: scale(26),
    fontWeight: '500',
    color: primaryPalette.light,
  },
  iapDescription: {
    fontFamily: 'Avenir',
    fontSize: scale(18),
    lineHeight: scale(22),
    fontWeight: '300',
    color: primaryPalette.light,
  },
  iapRight: {
    width: '35%',
  },
  iapChooseBtn: {
    borderWidth: 2,
    borderColor: primaryPalette.light,
    height: scale(40),
    width: '100%',
    borderRadius: scale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iapChooseBtnText: {
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(22),
    fontWeight: '400',
    color: primaryPalette.light,
  },
});

const dollaredStringToFloat = (price: string): number =>
  parseFloat((price ?? '0.00').replace('$', ''));

const RenderProductsIAP: React.FC<INavigation> = ({ navigation }) => {
  const p: ProductIAP[] = productsIAPSel();
  // {
  //   type: 'iap',
  //   productId: '1',
  //   title: 'the title',
  //   description: 'the desc',
  //   price: '$9.99',
  //   currency: 'USD',
  //   localizedPrice: '$9.99'
  // },
  // {
  //   type: 'iap',
  //   productId: '2',
  //   title: 'the title2',
  //   description: 'the desc3',
  //   price: '$9.99',
  //   currency: 'USD',
  //   localizedPrice: '$9.99'
  // }

  return (
    <View style={styles.iapWrapper}>
      {p
        .sort((a, b) => {
          return dollaredStringToFloat(a?.price) >
            dollaredStringToFloat(b?.price)
            ? 1
            : -1;
        })
        .map(piap => {
          return (
            <View key={piap.productId} style={styles.iapItem}>
              <View style={styles.iapLeft}>
                <Text style={styles.iapTitle}>{piap.title}</Text>
                <Text style={styles.iapDescription}>{piap.description}</Text>
              </View>
              <View style={styles.iapRight}>
                <TouchableOpacity
                  onPress={(): void => {
                    navigation.goBack();
                  }}
                  style={styles.iapChooseBtn}>
                  <Text style={styles.iapChooseBtnText}>Choose</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
    </View>
  );
};

const Plan: React.FC<PlanProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    productsIAPSel()?.length > 0,
  );

  return (
    <ScrollView
      // style={styles.wrapper}
      // contentInset={{ bottom: scale(50) }}
      contentContainerStyle={{
        marginHorizontal: scale(20),
      }}>
      <ImageBackground
        source={bg1Img}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          // display: 'none',
          marginTop: scale(80),
          height: scale(210),
          // alignSelf: 'center',
          // borderWidth: 1,
          width: '100%',
          borderColor: 'red',
          // marginLeft: '10%'
          // paddingHorizontal: scale(20)
        }}
        resizeMode="stretch"
        imageStyle={styles.bg1Img}>
        {/* <Text>Hey</Text> */}
        <Image source={h1Image} resizeMode="stretch" style={styles.h1Image} />
        <Text style={styles.p}>
          {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, */}
        </Text>
      </ImageBackground>
      <ImageBackground
        source={bg2Img}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          // height: scale(500),
          // alignSelf: 'center',
          // borderWidth: 1,
          width: '100%',
          height: scale(350),
          justifyContent: 'flex-end',
          paddingBottom: scale(20),
        }}
        resizeMode="stretch"
        imageStyle={styles.bg2Img}>
        <Modal
          isVisible={isModalOpen}
          onBackdropPress={(): void => {
            setIsModalOpen(false);
          }}>
          <RenderProductsIAP {...props} />
        </Modal>
        {/* <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Get Free Trial</Text>
        </TouchableOpacity> */}
      </ImageBackground>
    </ScrollView>
  );
};

export default Plan;
