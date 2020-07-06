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
// import MainNavigator from './src/navigators/MainNavigator';
import HomeNavigator from './src/navigators/HomeNavigator'; // , { CustomHeader }
import AuthNavigator from './src/navigators/AuthNavigator';

import RNBootSplash from 'react-native-bootsplash';
import { initSetGlobal } from './src/state_manager';
import {
  isLoggedInSel,
  getUserSessionSel,
} from './src/state_manager/selectors';
import {
  getCurrentSession,
  isProfileInfoComplete,
  withAskAndAppendDistance,
} from './src/utils';
import { placesGET, dealsGET } from './src/services/backend';
import MapPlaceholder from './src/containers/MapPlaceholder';

import { enableScreens } from 'react-native-screens';
import { WrappedSetPlaceType } from '.';

enableScreens();

initSetGlobal();

const { useState, useEffect, useGlobal } = React;

const App: React.FC = (): JSX.Element => {
  const [, setUserData] = useGlobal('currentUser');
  const [currentGeoCoordinates, setCurrentGeoCoordinates] = useGlobal(
    'currentGeoCoordinates',
  );
  const [, setPlaces] = useGlobal('places');
  const [, setDeals] = useGlobal('placeDeal');
  const [, setIsInitialDataFetched] = useGlobal('isInitialDataFetched');

  const [loadingSplash, setLoadingSplash] = useState(true);
  // const [localIsLoggedIn, setLocalIsLoggedIn] = useState(isLoggedInSel());

  const asyncDidMount = async (): Promise<void> => {
    try {
      await getCurrentSession(setUserData);

      if (isLoggedInSel() === true) {
        // let hadPermission = false;

        // /* only ios asks location permission per rnmaps? */
        // if (Platform.OS === 'android') {
        //   hadPermission =
        //     (await getPermissionAsync({
        //       type: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        //     })) === 'granted';
        // } else {
        //   hadPermission =
        //     (await getPermissionAsync({
        //       type: PERMISSIONS.IOS.LOCATION_ALWAYS,
        //     })) === 'granted';
        // }
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

        // console.log(
        //   'wegotss APPTSX',
        //   (getPlacesSel() as Place[]).map(p => p.distance ?? p.name),
        // );

        // try {
        //   if (hadPermission) {
        //     const geoPosition = await getCurrentPositionAsync<GeoPosition>();
        //     if (geoPosition?.coords?.latitude) {
        //       await setCurrentGeoCoordinates({
        //         ...currentGeoCoordinates,
        //         latitude: geoPosition.coords.latitude,
        //         longitude: geoPosition.coords.longitude,
        //       });
        //       const newPlaces = await appendDistancesAsync(
        //         res,
        //         geoPosition.coords,
        //       );
        //       await setPlaces(newPlaces);
        //     }
        //   }
        // } catch (e) {
        //   console.log('getCurrentPositionAsync e', e);
        // }
        const resDeal = await dealsGET();
        setDeals(resDeal);
      }
    } catch (e) {
      console.log('initialDataFetched', e);
    }
    setIsInitialDataFetched(true);
  };

  // console.log('before', isLoggedInSel(), isProfileInfoComplete(getUserSessionSel().user))
  useEffect(() => {
    asyncDidMount().finally(() => {
      // without fadeout: RNBootSplash.hide()
      setLoadingSplash(false);
      RNBootSplash.hide({ duration: 250 });
    });
  }, [isLoggedInSel(), isProfileInfoComplete(getUserSessionSel().user)]);

  if (isLoggedInSel()) {
    if (!isProfileInfoComplete(getUserSessionSel().user)) {
      return <AuthNavigator />;
    }
  } else {
    return <AuthNavigator />;
  }

  if (loadingSplash) {
    return <MapPlaceholder loadingSplash={loadingSplash} />;
  }

  return <HomeNavigator />;
  // return <HomeNavigator />;
  // return <Plan />;
  // return <ListDeals />
};

export default App;
