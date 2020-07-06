import React from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextStyle,
  FlatList,
  Alert,
  Platform,
  Text,
  ListRenderItemInfo,
} from 'react-native';
// import { RNCamera } from 'react-native-camera';
import { INavigation, Place, PlaceDeal, CurrentMapRegion } from '../..';
import {
  scale,
  getStatusBarHeight,
  primaryPalette,
  getPermissionAsync,
  getARHeightByWidth,
  onShare,
} from '../utils';

import imgClose from '../assets/images/back.png';
import imgCursor from '../assets/images/cursor-white.png';
import imgPin from '../assets/images/icon-pin.png';
import imgDealOrangeBG from '../assets/images/deal-orange-bg.png';
import imgDealBlueBG from '../assets/images/deal-blue-bg.png';
import parallaxStyles from './parallaxStyles';
import ProgressiveImage from '../commons/components/ProgressiveImage';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {
  WIDTH_WINDOW,
  ASPECT_RATIO_MAIN_IMG,
  HEIGHT_WINDOW,
} from '../utils/constants';
// import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import Modal from 'react-native-modal';
import { ButtonShadowed } from '../commons/components';
import { getPlaceDealSel, currentFormSel } from '../state_manager/selectors';
import EnterDealModalContent from './Deals/EnterDealModalContent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PERMISSIONS } from 'react-native-permissions';
import { NavigationStackOptions } from 'react-navigation-stack';
import { useGlobal } from 'reactn';
// import { PERMISSIONS } from 'react-native-permissions';
// const AnimatedCustomScrollView = Animated.createAnimatedComponent(CustomScrollView)

const { useEffect, useRef, useState } = React;

interface BusinessStyle {
  wrapper: ViewStyle;
  h1: TextStyle;
  img: ImageStyle;
  imgCloseBtn: ViewStyle;
  imgClose: ImageStyle;
  imgSaveEditsBtn: ViewStyle;
  saveEditsText: TextStyle;
  iconEditBtn: ViewStyle;
  discardEditText: TextStyle;
  imgBulletLine: ImageStyle;

  rowWrapper: ViewStyle;

  btnPencilEditBtn: ViewStyle;
  imgPencilEdit: ImageStyle;

  section1wrapper: ViewStyle;

  greyed: TextStyle;

  contactItemWrapper: ViewStyle;
  section3wrapper: ViewStyle;
  section3ContactTitle: TextStyle;

  contactLabel: TextStyle;
  contactText: TextStyle;

  section4MapAddressWrapper: ImageStyle;
  section4HeaderWrapper: ViewStyle;
  section4Whereisthat: TextStyle;
  section4AddressTitle: TextStyle;
  section4Address: TextStyle;

  btnCheckit: ViewStyle;
  btnImageCheckit: ImageStyle;

  section4DetailsWrapper: ViewStyle;
  section4YouAreHereImage: ImageStyle;
}

const HEIGHT_MAIN_IMG = Math.round(
  getARHeightByWidth(ASPECT_RATIO_MAIN_IMG, WIDTH_WINDOW),
);

export const styleImg = {
  width: '100%',
  height: HEIGHT_MAIN_IMG,
  aspectRatio: ASPECT_RATIO_MAIN_IMG[0] / ASPECT_RATIO_MAIN_IMG[1],
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    // backgroundColor: primaryPalette.grey
  },
  h1: {
    fontFamily: 'Avenir',
    fontWeight: '800',
    fontSize: scale(19),
    lineHeight: scale(24),
    textAlign: 'left',
    color: primaryPalette.dark,
  },
  img: styleImg,
  imgCloseBtn: {
    // flex: 1,
    marginTop: getStatusBarHeight(true),
    padding: scale(9),
    // marginLeft: sizeX3L,
    width: scale(30),
    // padding: scale(5)
  },
  imgClose: {
    height: scale(22),
    width: scale(20),
  },
  section1wrapper: {
    // minHeight: scale(50)
  },
  section2Address: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(13),
  },
  section2Left: {
    flex: 1,
    flexDirection: 'row',
    // width: '5%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  section2Right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCursorBtn: {
    marginTop: 0,
    // alignSelf: 'center',
    backgroundColor: primaryPalette.blue,
  },
  section2AddressText: {
    fontFamily: 'Avenir',
    lineHeight: scale(20),
    fontSize: scale(15),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  section2pinImg: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(7),
  },
  section3PlaceDeals: {
    flex: 1,
    padding: scale(20),
    marginTop: scale(10),
  },
  section3DealItem: {
    height: scale(170),
    paddingVertical: scale(10),
  },
  imgDealWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: scale(10),
  },
  dealPercentageText: {
    color: '#f18f01',
    fontFamily: 'Avenir',
    fontSize: scale(20),
    lineHeight: scale(24),
    fontWeight: '600',
  },
  dealDescription: {
    color: primaryPalette.dark,
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(21),
    fontWeight: '300',
  },
  imgDealBg: {
    // height: scale(145),
    // width: scale(275),
  },

  section4Footer: {
    flex: 1,
    marginVertical: scale(30),
    alignSelf: 'center',
  },

  section4FooterRightBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(38),
    backgroundColor: primaryPalette.orange,
    borderRadius: scale(20),
    width: scale(165),
  },
  section4FooterRightBtnText: {
    color: primaryPalette.light,
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '400',
  },
});

interface PlaceComponentProps extends INavigation<Place> {
  place: Place;
}

const Section1Title: React.FC<{
  title: string;
}> = ({ title }) => {
  return (
    <View style={styles.section1wrapper}>
      <Text style={styles.h1}>{title}</Text>
    </View>
  );
};

const Section2Address: React.FC<PlaceComponentProps> = ({
  place,
  navigation,
}) => {
  const [, setCurrentForm] = useGlobal('currentForm');

  return (
    <View style={styles.section2Address}>
      <View style={styles.section2Left}>
        <Image
          source={imgPin}
          resizeMode="contain"
          style={styles.section2pinImg}
        />
        <Text style={styles.section2AddressText}>{place.address}</Text>
      </View>
      <View style={styles.section2Right}>
        <ButtonShadowed
          onPress={(): void => {
            if (place.long && place.lat) {
              setCurrentForm({
                ...currentFormSel<CurrentMapRegion>(),
                regionCenteteredPlaceId: place.id,
                region: {
                  ...(currentFormSel<CurrentMapRegion>()?.region ?? {}),
                  latitude: parseFloat(place.lat),
                  longitude: parseFloat(place.long),
                },
              });
              // const resetAction = StackActions.reset({
              //   index: 0,
              //   actions: [
              //     NavigationActions.navigate({
              //       routeName: 'Home',
              //     }),
              //   ],
              //   key: null,
              // });

              // navigation.dispatch(resetAction);
              navigation.navigate('HomeMap');
            }
          }}
          size={40}
          btnStyle={styles.btnCursorBtn}
          contentImgSource={imgCursor}
        />
      </View>
    </View>
  );
};

interface ItemProps extends PlaceDeal {
  navigate: INavigation['navigation']['navigate'];
}

const Section3PlaceDeals: React.FC<{
  place: Place;
  deals: PlaceDeal[];
  onPressDeal: (deal: PlaceDeal) => void;
}> = ({ place, deals, onPressDeal }) => {
  if (!deals?.length) {
    return <></>;
  }

  const RenderListItem: React.FC<ListRenderItemInfo<ItemProps>> = (
    props,
  ): JSX.Element => {
    const { item, index } = props;
    const deal = item;

    const isOddEven = index % 2 === 0;

    const FEATURE_DEPRECATED = true;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={(): void => {
          onPressDeal(deal);
        }}
        key={deal.id}
        style={styles.section3DealItem}>
        {FEATURE_DEPRECATED ? (
          <View
            style={[
              styles.imgDealWrapper,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderColor: primaryPalette.dark,
                borderWidth: 3,
                borderStyle: 'dotted',
              },
            ]}>
            <Text
              style={[
                styles.dealPercentageText,
                isOddEven ? {} : { color: primaryPalette.blue },
              ]}>
              Get {deal.discount_percentage}%
            </Text>
            <Text style={styles.dealDescription}>{deal.description}</Text>
          </View>
        ) : (
          <ImageBackground
            // source={isOddEven ? imgDealOrangeBG : imgDealBlueBG}
            source={
              place?.thumbnail ?? false
                ? {
                    url: place.thumbnail,
                  }
                : isOddEven
                ? imgDealOrangeBG
                : imgDealBlueBG
            }
            resizeMode="stretch"
            style={styles.imgDealWrapper}
            imageStyle={styles.imgDealBg}>
            <Text
              style={[
                styles.dealPercentageText,
                isOddEven ? {} : { color: primaryPalette.blue },
              ]}>
              Get {deal.discount_percentage}%
            </Text>
            <Text style={styles.dealDescription}>{deal.description}</Text>
          </ImageBackground>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={deals as ItemProps[]}
      renderItem={RenderListItem}
      style={styles.section3PlaceDeals}
    />
  );
};

const Section4Footer: React.FC = () => {
  return (
    <View style={styles.section4Footer}>
      <TouchableOpacity
        // onPress={onShare}
        onPress={(): void => {
          console.log('upgrade to premium');
        }}
        style={styles.section4FooterRightBtn}>
        <Text style={styles.section4FooterRightBtnText}>
          {/* Share with Friends */}
          Upgrade to premium
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PlaceComponent: React.FC<PlaceComponentProps> = ({ navigation }) => {
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [deal, setDeal] = useState<PlaceDeal>({} as PlaceDeal);
  // const [pickedCameraImage, setPickedCameraImage] = useState<
  //   ImagePickerResponseWithImageSource
  // >({} as ImagePickerResponseWithImageSource);

  const flatListRef = useRef(null);
  const item = navigation?.state.params;
  const timerT1 = useRef<global.setTimeout>(null);
  const timerT2 = useRef<global.setTimeout>(null);
  const placeDeal = getPlaceDealSel(item?.id);

  const PARALLAX_HEADER_HEIGHT = HEIGHT_MAIN_IMG;

  useEffect(() => {
    // const didFocusSub = navigation.addListener('didFocus', payload => {
    //   console.log('didFocus payload', payload.lastState);
    // this.forceUpdate();
    // });
    // return (): void => {
    //   console.log('toclean', typeof didFocusSub);
    //   didFocusSub.remove();
    //   console.log('cleaneed!', didFocusSub);
    // };
    return (): void => {
      if (timerT1?.current) {
        clearInterval(timerT1?.current);
      }
      if (timerT2?.current) {
        clearInterval(timerT2?.current);
      }
    };
  }, []);

  const onPressDeal = async (deal_: PlaceDeal): Promise<void> => {
    try {
      const result = await getPermissionAsync({
        type:
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.CAMERA
            : PERMISSIONS.IOS.CAMERA,
      });

      if (result !== 'granted') {
        Alert.alert(
          'Missing Camera Permission',
          'Please allow camera access in app settings to make this work.',
        );
        return;
      }

      await setDeal(deal_);
      await setIsDealModalOpen(true);
    } catch (e) {
      console.log('onPressDeal e', e);
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      style={parallaxStyles.container}
      refreshing={true}
      data={['dummy']}
      renderItem={(): JSX.Element => (
        <View style={styles.wrapper}>
          <Section1Title title={item?.name ?? ''} />
          <Section2Address navigation={navigation} place={item as Place} />
          <Section3PlaceDeals
            place={item as Place}
            deals={placeDeal}
            onPressDeal={onPressDeal}
          />
          <Section4Footer />
        </View>
      )}
      renderScrollComponent={(): JSX.Element => (
        <ParallaxScrollView
          // onScroll={onScroll}
          headerBackgroundColor="#333"
          stickyHeaderHeight={0}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundSpeed={10}
          renderBackground={(): JSX.Element => (
            <View key="background">
              {/* <Image
                  source={{
                    uri: 'https://test-inba.s3-ap-northeast-1.amazonaws.com/photo/7641978d-61db-448a-8b03-4ee8fc9eb0db.png',
                    width: WIDTH_WINDOW,
                    height: PARALLAX_HEADER_HEIGHT
                  }}
                /> */}
              <ProgressiveImage
                resizeMode="cover"
                // thumbnailSource={
                //   (getThumbnailSource(currentBusiness) as unknown) as number
                // }
                source={{
                  uri: item?.image ?? '',
                }}
                style={styles.img}
              />
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  position: 'absolute',
                  top: 0,
                  width: WIDTH_WINDOW,
                  // backgroundColor: 'rgba(0,0,0,.4)',
                  height: PARALLAX_HEADER_HEIGHT,
                }}
              />
            </View>
          )}
          renderForeground={(): JSX.Element => (
            <View
              // keyboardShouldPersistTaps="handled"
              key="parallax-header"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flex: 1 }}
              // contentContainerStyle={parallaxStyles.parallaxHeader}
            >
              <Modal
                onBackdropPress={(): void => {
                  setIsDealModalOpen(false);
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
                isVisible={isDealModalOpen}>
                <KeyboardAwareScrollView
                  extraHeight={scale(130)}
                  keyboardShouldPersistTaps="handled">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={(): void => {
                      setIsDealModalOpen(false);
                    }}
                    style={{ height: HEIGHT_WINDOW * 0.6 }}
                  />
                  <EnterDealModalContent
                    deal={deal}
                    navigation={navigation}
                    onCloseModal={(): void => {
                      setIsDealModalOpen(false);
                    }}
                  />
                </KeyboardAwareScrollView>
              </Modal>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  maxHeight: scale(80),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '96%',
                  marginLeft: '2%',
                }}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 1,
                    width: '32%',
                  }}>
                  <TouchableOpacity
                    onPress={(): void => {
                      navigation.goBack();
                    }}
                    style={styles.imgCloseBtn}>
                    <Image
                      resizeMode="contain"
                      source={imgClose}
                      style={styles.imgClose}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 2,
                    width: '32%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 1,
                    width: '32%',
                  }}
                />
              </View>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  alignSelf: 'flex-end',
                  height: Math.round(PARALLAX_HEADER_HEIGHT * 0.77),
                }}
              />
            </View>
          )}
          renderStickyHeader={(): JSX.Element => (
            <View key="sticky-header" style={parallaxStyles.stickySection}>
              <Text style={parallaxStyles.stickySectionText}>HIDDENTEXT</Text>
            </View>
          )}
          renderFixedHeader={(): JSX.Element => (
            <View key="fixed-header" style={parallaxStyles.fixedSection}>
              <Text
                style={parallaxStyles.fixedSectionText}
                // onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}
              >
                HIDDENTEXT
              </Text>
            </View>
          )}
        />
      )}
    />
  );
};

PlaceComponent.navigationOptions = (): NavigationStackOptions => ({
  header: null,
});

export default PlaceComponent;
