import React, { useRef } from 'reactn';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import * as RNIap from 'react-native-iap';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageStyle,
  StatusBar,
  TextStyle,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import cursorImg from '../assets/images/cursor.png';
import shopMapIcon from '../assets/images/shop-map-icon.png';
import shopMapActiveIcon from '../assets/images/shop-map-icon-active.png';
import {
  scale,
  primaryPalette,
  isIphoneScreenWidthSmall,
  onShare,
  getPlacesSortHash,
  getDistanceText,
  withAskAndAppendDistance,
  filterPlaceList,
} from '../utils';
import { placesGET, dealsGET } from '../services/backend';
import {
  getPlacesSel,
  currentGeoCoordinatesSel,
  isInitialDataFetchedSel,
  currentFormSel,
  currentFilterSel,
  getPlacesSortedByDeals,
} from '../state_manager/selectors';
import {
  INavigation,
  Place,
  HomeSwitchRouteNames,
  WrappedSetPlaceType,
  CurrentMapRegion,
} from '../..';
import { PanelSearchResult } from '../commons/components';
import { styleImg } from './PlaceComponent';

const { useGlobal, useState, useEffect } = React;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
interface HomeStyles {
  wrapper: ViewStyle;
  listItemWrapper: ViewStyle;
  listItemImg: ImageStyle;
  listItemTitle: TextStyle;
  listItemDistanceText: TextStyle;
  listFooter: ViewStyle;

  footer: ViewStyle;
  footerRightBtn: ViewStyle;
  footerRightBtnText: TextStyle;
  footerLeftBtn: ViewStyle;
  footerLeftBtnText: TextStyle;

  shopMapBtn: ViewStyle;
  shopMapIcon: ImageStyle;
}

const styles = StyleSheet.create<HomeStyles>({
  wrapper: {
    marginTop: isIphoneScreenWidthSmall() ? scale(60) : scale(80),
    flex: 1,
  },
  listItemWrapper: {
    // borderColor: 'black', borderWidth: 2,
    // borderColor: 'orange',
    // borderWidth: 1,
    // flex: 1,
    flexDirection: 'column',
    height: styleImg.height + scale(20),
    marginHorizontal: scale(15),
    marginTop: scale(10),
    marginBottom: scale(30),
  },
  listFooter: {
    // borderColor: 'red',
    // borderWidth: 1,
    marginTop: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemImg: {
    ...styleImg,
    aspectRatio: styleImg.aspectRatio * 0.92,
    borderTopRightRadius: scale(30),
    borderTopLeftRadius: scale(30),

    // width: '100%',
    // height: scale(140),
  },
  listItemTitle: {
    color: primaryPalette.dark,
    fontFamily: 'Avenir',
    fontSize: scale(19),
    lineHeight: scale(24),
    fontWeight: '800',
  },
  listItemDistanceText: {
    color: primaryPalette.dark,
    fontFamily: 'Avenir',
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '200',
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: scale(15),
    paddingHorizontal: scale(10),
    // height: scale(50),
    // marginHorizontal: scale(10),
  },
  footerRightBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(35),
    backgroundColor: primaryPalette.orange,
    borderRadius: scale(25),
    width: isIphoneScreenWidthSmall() ? scale(140) : scale(160),
  },
  footerRightBtnText: {
    color: primaryPalette.light,
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '400',
  },
  footerLeftBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(35),
    borderWidth: 2,
    borderColor: primaryPalette.blue,
    borderRadius: scale(25),
    width: isIphoneScreenWidthSmall() ? scale(140) : scale(160),
  },
  footerLeftBtnText: {
    color: primaryPalette.blue,
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '400',
  },
  shopMapBtn: {
    padding: scale(3),
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(25),
    height: scale(25),
  },
  shopMapIcon: {
    width: scale(25),
    height: scale(25),
  },
});

const RenderSection1Map: React.FC<INavigation> = ({
  navigation,
}): JSX.Element => {
  const refMapView = useRef<MapView>(null);
  const [
    isPanelSearchResultCollapsed,
    setIsPanelSearchResultCollapsed,
  ] = useState(false);
  const [region] = useState<Region>(
    (currentGeoCoordinatesSel() as unknown) as Region,
  );

  // console.log('curr', isInitialDataFetchedSel(), currentGeoCoordinatesSel());
  useEffect(() => {
    // setRegion({
    //   ...region,
    //   latitude:
    //     currentFormSel<CurrentMapRegion>()?.region?.latitude ??
    //     currentGeoCoordinatesSel().latitude,
    //   longitude:
    //     currentFormSel<CurrentMapRegion>()?.region?.longitude ??
    //     currentGeoCoordinatesSel().longitude,
    // });

    if (currentFormSel<CurrentMapRegion>()?.region?.latitude) {
      refMapView?.current?.animateCamera({
        center: {
          latitude:
            currentFormSel<CurrentMapRegion>()?.region?.latitude ??
            currentGeoCoordinatesSel().latitude,
          longitude:
            currentFormSel<CurrentMapRegion>()?.region?.longitude ??
            currentGeoCoordinatesSel().longitude,
        },
      });
    }
  }, [
    currentGeoCoordinatesSel().latitude,
    currentFormSel<CurrentMapRegion>()?.region?.latitude ?? false,
    // false,
  ]);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      <MapView
        onRegionChangeComplete={(): void => {
          // onSubmitSearch({
          //   lat: region.latitude,
          //   lng: region.longitude,
          // });
        }}
        ref={refMapView}
        style={
          isPanelSearchResultCollapsed === true
            ? { height: scale(200) }
            : { flex: 1 }
        }
        // showsUserLocation={true}
        region={region}
        initialRegion={region}
        showsUserLocation={true}
        // region={region}
        provider={PROVIDER_GOOGLE}>
        {((getPlacesSel() ?? []) as Place[]).map(place => {
          const isActive =
            place.id ===
            currentFormSel<CurrentMapRegion>().regionCenteteredPlaceId;
          // if (Platform.OS === 'android') {
          //   place.lat =
          //     (place?.lat
          //       ? Math.round(((place.lat as unknown) as number) * 1000000) /
          //         1000000
          //       : 0) + '';

          //   place.long =
          //     (place?.long
          //       ? Math.round(((place.long as unknown) as number) * 1000000) /
          //         1000000
          //       : 0) + '';
          // }
          return place.lat && place.long ? (
            <Marker
              style={styles.shopMapBtn}
              onPress={(): void => {
                navigation.navigate('PlaceComponent', place);
              }}
              coordinate={{
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.long),
              }}
              // title={place.name}
              // description={place.address}
            >
              {place?.thumbnail?.length > 0 ? (
                <Image
                  resizeMode="contain"
                  source={{ uri: place.thumbnail }}
                  style={styles.shopMapIcon}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  source={isActive ? shopMapActiveIcon : shopMapIcon}
                  style={styles.shopMapIcon}
                />
              )}
            </Marker>
          ) : (
            <></>
          );
        })}
      </MapView>
      <PanelSearchResult
        isPanelSearchResultCollapsed={isPanelSearchResultCollapsed}
        setIsPanelSearchResultCollapsed={(isCollapsed: boolean): void => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          if (isCollapsed !== isPanelSearchResultCollapsed) {
            setIsPanelSearchResultCollapsed(isCollapsed);
          }
        }}
        navigation={navigation}
      />
    </View>
  );
};

interface ItemProps extends Place {
  navigate: INavigation['navigation']['navigate'];
}

const RenderListItem: React.FC<ListRenderItemInfo<ItemProps>> = (
  props,
): JSX.Element => {
  const { item } = props;

  return (
    <TouchableOpacity
      onPress={(): void => {
        item.navigate('PlaceComponent', getPlacesSel(item.id));
      }}
      activeOpacity={0.8}
      style={styles.listItemWrapper}>
      <Image
        resizeMode="cover"
        source={{
          uri: item.image,
        }}
        style={styles.listItemImg}
      />

      <View style={styles.listFooter}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        {item?.distance ?? false ? (
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}>
            <Image
              source={cursorImg}
              resizeMode="contain"
              style={{
                width: scale(14),
                height: scale(14),
                marginRight: scale(10),
              }}
            />
            <Text style={styles.listItemDistanceText}>
              {getDistanceText(item.distance)}
            </Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
};

interface HomeSearchForm {
  searchText: string;
}
type RenderSection1ListProps = HomeProps;

const RenderSection1List: React.FC<RenderSection1ListProps> = (
  props,
): JSX.Element => {
  const { navigation } = props;

  // ! selectors won't trigger re-render without these useGlobal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentFilter] = useGlobal('currentFilter');
  const [currentGeoCoordinates, setCurrentGeoCoordinates] = useGlobal(
    'currentGeoCoordinates',
  );
  const [, setPlaces] = useGlobal('places');
  const [, setDeals] = useGlobal('placeDeal');

  const [loading, setLoading] = useState(false);
  const searchText = (currentFormSel() as HomeSearchForm).searchText;
  const currentFilter = currentFilterSel();
  const list = filterPlaceList(
    getPlacesSel() as Place[],
    currentFilter,
    navigation.navigate,
    getPlacesSortedByDeals,
    searchText,
  );

  const [appendedNavigate, setAppendedNavigate] = useState<ItemProps[]>(list);

  const onRefresh = async (): Promise<void> => {
    try {
      await setLoading(true);
      const res = await placesGET();
      const FORCE_HAVERSINE = true;
      await withAskAndAppendDistance(
        (setPlaces as unknown) as WrappedSetPlaceType,
        currentGeoCoordinates,
        setCurrentGeoCoordinates,
        FORCE_HAVERSINE,
      )(res);

      /* this is where we process distance in the background */
      setTimeout(async (): Promise<void> => {
        const FORCE_HAVERSINE_HERE = false;
        await withAskAndAppendDistance(
          (setPlaces as unknown) as WrappedSetPlaceType,
          currentGeoCoordinates,
          setCurrentGeoCoordinates,
          FORCE_HAVERSINE_HERE,
        )(res);
      }, 0);
      const listPerEffect = filterPlaceList(
        getPlacesSel() as Place[],
        currentFilter,
        navigation.navigate,
        getPlacesSortedByDeals,
        searchText,
      );

      // manual memoize-ish implementation
      if (
        getPlacesSortHash(appendedNavigate) !== getPlacesSortHash(listPerEffect)
      ) {
        setAppendedNavigate(listPerEffect);
      }

      // try {
      //   const geoPosition = await getCurrentPositionAsync<GeoPosition>();
      //   if (geoPosition?.coords?.latitude) {
      //     const newPlaces = await appendDistancesAsync(res, geoPosition.coords);
      //     await setPlaces(newPlaces);
      //   }
      // } catch (e) {
      //   console.log('getCurrentPositionAsync e', e);
      // }
      const resDeal = await dealsGET();
      await setDeals(resDeal);
    } catch (e) {
      console.log('home on refresh', e);
    }

    await setLoading(false);
  };

  /*
    used for simple manual refresh list
    when background async google distance calculation resolves
  */
  const hashedDistance = (getPlacesSel() as Place[]).reduce((acc, cur, i) => {
    return i > 3 ? acc : acc + (cur?.distance ?? '');
  }, '');

  useEffect(() => {
    const didFocusSubAction = (): void => {
      const listOnMaterialTopTabFocus = filterPlaceList(
        getPlacesSel() as Place[],
        currentFilter,
        navigation.navigate,
        getPlacesSortedByDeals,
        searchText,
      );

      // manual memoize-ish implementation
      if (
        getPlacesSortHash(appendedNavigate) !==
        getPlacesSortHash(listOnMaterialTopTabFocus)
      ) {
        setAppendedNavigate(listOnMaterialTopTabFocus);
      }
    };
    const didFocusSub = navigation.addListener('didFocus', didFocusSubAction);

    const listPerEffect = filterPlaceList(
      getPlacesSel() as Place[],
      currentFilter,
      navigation.navigate,
      getPlacesSortedByDeals,
      searchText,
    );

    // manual memoize-ish implementation
    if (
      getPlacesSortHash(appendedNavigate) !== getPlacesSortHash(listPerEffect)
    ) {
      setAppendedNavigate(listPerEffect);
    }

    return (): void => {
      // return;
      // console.log('befoer elavin!', navigation.state.routeName)
      didFocusSub.remove();
    };
  }, [hashedDistance, searchText, currentFilter]);

  if (!isInitialDataFetchedSel()) {
    return (
      <View style={styles.listItemWrapper}>
        <Placeholder
          Animation={Fade}
          Left={PlaceholderMedia}
          Right={PlaceholderMedia}>
          <PlaceholderLine width={80} />
          <PlaceholderLine />
          <PlaceholderLine width={30} />
        </Placeholder>
      </View>
    );
  }

  // console.log('appendedNavigate', appendedNavigate.length, appendedNavigate.map(a => a.id));

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
      data={(appendedNavigate as unknown) as ItemProps[]}
      renderItem={RenderListItem}
      contentInset={{ bottom: scale(50) }}
    />
  );
};

const RenderFooter: React.FC<INavigation> = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.navigate('Plan');
        }}
        style={styles.footerLeftBtn}>
        <Text style={styles.footerLeftBtnText}>Subscribe</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare} style={styles.footerRightBtn}>
        <Text style={styles.footerRightBtnText}>Invite Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

type HomeProps = INavigation;

const itemSubs = Platform.select({
  ios: ['dollarback.one.month.sub', 'dollarback.three.months'],
  android: [
    'test.sub1', // subscription
  ],
});

const Home: React.FC<HomeProps> = (props): JSX.Element => {
  const [, setCurrentForm] = useGlobal('currentForm');
  const [, setProductsIAP] = useGlobal('productsIAP');
  const { navigation } = props;
  const routeName: HomeSwitchRouteNames = navigation.state
    .routeName as HomeSwitchRouteNames;
  const [
    isRenderedAfterInitialDataFetch,
    setIsRenderedAfterInitialDataFetch,
  ] = useState(false);
  // console.log('routeNamerouteName', routeName);
  // const asyncDidMount = async (): Promise<void> => {
  //   const res = await placesGET();
  // }

  const asyncRNIapPrepare = async (): Promise<void> => {
    try {
      const connResult = await RNIap.initConnection();
      console.log('connResult', connResult);
      // await RNIap.consumeAllItemsAndroid();
      const products = await RNIap.getProducts(itemSubs as string[]);
      // console.log('connResult, products', connResult, products);
      setProductsIAP(products);
    } catch (e) {
      console.log('asyncRNIapPrepare e', e);
    }
  };

  useEffect(() => {
    setCurrentForm({});

    if (Platform.OS === 'ios') {
      asyncRNIapPrepare();
    }

    const didFocusSub = navigation.addListener('didFocus', (): void => {
      if (isRenderedAfterInitialDataFetch !== isInitialDataFetchedSel()) {
        setIsRenderedAfterInitialDataFetch(true);
      }
    });

    return (): void => {
      didFocusSub.remove();
    };
  }, [isInitialDataFetchedSel()]);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      {routeName === 'HomeMap' ? (
        <RenderSection1Map {...props} />
      ) : (
        <RenderSection1List {...props} />
      )}
      <RenderFooter {...props} />
    </View>
  );
};

export default Home;
