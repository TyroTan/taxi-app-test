import { getGlobal } from 'reactn';
import { UserData, Place, PlaceDeal, Filter, ProductIAP } from '../..';
import { GeoCoordinates } from 'react-native-geolocation-service';

const getUserSessionSel = (): UserData => {
  const userData = getGlobal().currentUser;

  return userData;
};

const isLoggedInSel = (): boolean => {
  const userData = getUserSessionSel();

  return userData.token?.length > 1;
};

const currentGeoCoordinatesSel = (): GeoCoordinates => {
  const currentGeoCoordinates = getGlobal().currentGeoCoordinates;

  return currentGeoCoordinates;
};

const isInitialDataFetchedSel = (): boolean => {
  const bool = getGlobal().isInitialDataFetched;

  return bool;
};

const currentFormSel = <T = {}>(): T => getGlobal().currentForm as T;
const productsIAPSel = (): ProductIAP[] => getGlobal().productsIAP;

const getPlacesSel = (placeId?: number): Place | Place[] => {
  const i = placeId ?? -1;

  return i > -1
    ? (getGlobal().places?.find(p => p?.id === placeId) as Place)
    : (getGlobal().places.map(place => ({
        ...place,
      })) as Place[]);
};

const getPlaceDealSel = (placeId?: number): PlaceDeal[] => {
  const id = placeId ?? -1;
  const placeDeals = getGlobal().placeDeal;

  return id > -1
    ? (placeDeals.filter(deal => deal.place === id) as PlaceDeal[])
    : (placeDeals as PlaceDeal[]);
};

const getPlacesSortedByDeals = (places: Place[]): Place[] => {
  return places
    .map(place => {
      const deals = getPlaceDealSel(place.id)
        .sort((a, b) => {
          return a.discount_percentage > b.discount_percentage ? -1 : 1; // highest percentage first
        })
        .map(deal => deal.discount_percentage);

      return {
        ...place,
        maxDealForSort: deals?.length > 0 ? Math.max(...deals) : 0,
      };
    })
    .sort((a, b) => {
      // console.log(
      //   'a.id, a?.maxDealForSort',
      //   a.id,
      //   a?.maxDealForSort,
      //   b.id,
      //   b?.maxDealForSort,
      // );
      return (a?.maxDealForSort ?? 0) > (b?.maxDealForSort ?? 0) ? -1 : 1;
    });

  // return places
};

const currentNavigationPopupMessageSel = (): string => {
  return getGlobal().currentNavigationPopupMessage;
};

const currentFilterSel = (): Filter => {
  return getGlobal().currentFilter;
};

export {
  getUserSessionSel,
  isLoggedInSel,
  productsIAPSel,
  getPlacesSel,
  getPlaceDealSel,
  currentGeoCoordinatesSel,
  isInitialDataFetchedSel,
  currentFormSel,
  currentNavigationPopupMessageSel,
  currentFilterSel,
  getPlacesSortedByDeals,
};
