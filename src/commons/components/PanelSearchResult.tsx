import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect, useRef, useGlobal } from 'reactn';
import { Place, INavigation, CurrentMapRegion } from '../../..';
import { getPlacesSel, currentFormSel } from '../../state_manager/selectors';
import { scale, primaryPalette, getDistanceText } from '../../utils';
import Divider from './Divider';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,

    elevation: 2,

    shadowColor: '#a0a0a0',
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  itemWrapper: {
    // height: scale(150),
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
  },
  name: {
    fontFamily: 'Avenir',
    fontWeight: '600',
    fontSize: scale(18),
    lineHeight: scale(24),
    color: primaryPalette.dark,
  },
  address: {
    fontFamily: 'Avenir',
    fontWeight: '400',
    fontSize: scale(16),
    lineHeight: scale(20),
    color: primaryPalette.dark,
    opacity: 0.75,
  },
});

const PanelSearchResult: React.FC<{
  isPanelSearchResultCollapsed: boolean;
  setIsPanelSearchResultCollapsed: (isCollapsed: boolean) => void;
  navigation: INavigation['navigation'];
}> = ({
  isPanelSearchResultCollapsed,
  setIsPanelSearchResultCollapsed,
  navigation,
}) => {
  const debouncer = useRef<NodeJS.Timeout | null>(null);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [searchResult, setSearchResult] = useState<Place[]>();

  /*
    used for simple manual refresh list
    when background async google distance calculation resolves
  */
  const hashedDistance = (getPlacesSel() as Place[]).reduce((acc, cur, i) => {
    return i > 3 ? acc : acc + (cur?.distance ?? '');
  }, '');

  const [
    rerenderBasedOnHashedDistance,
    setRerenderBasedOnHashedDistance,
  ] = useState(hashedDistance);
  // getPlacesSel() as Place[],

  const processSearchResult = (): void => {
    const searchText =
      currentFormSel<{
        searchText?: string;
      }>()?.searchText ?? '';

    let list = [
      ...(getPlacesSel() as Place[])
        .sort((a, b) => ((a?.distance ?? -1) > (b?.distance ?? -1) ? 1 : -1))
        .map(place => ({
          ...place,
          navigate: navigation.navigate,
        })),
    ];

    if (!searchText) {
      // setSearchResult(list);
      setIsPanelSearchResultCollapsed(false);
      return;
    }

    list = list.filter(place => {
      const placeWords = place.name.split(' ');
      const searchTextWords = searchText.split(' ');
      return searchTextWords.reduce((acc, cur) => {
        return acc === true
          ? true
          : placeWords.findIndex(name => name.toLowerCase() === cur) > -1;
      }, false);
    });

    /*
    const exactMatch = list.length
      ? list.find(l => l.name.toLowerCase() === searchText)
      : null;

    if (exactMatch !== null) {
      setSearchResult([exactMatch, ...list]);
    }
    */
    if ((list?.length ?? 0) > 0) {
      setSearchResult(list);
      setIsPanelSearchResultCollapsed(true);
    } else {
      setIsPanelSearchResultCollapsed(false);
    }
  };

  useEffect(() => {
    if (debouncer?.current ?? false) {
      clearTimeout(debouncer.current as NodeJS.Timeout);
    }

    const didFocusSubAction = (): void => {
      const hashedDistanceUponTabFocus = (getPlacesSel() as Place[]).reduce(
        (acc, cur, i) => {
          return i > 3 ? acc : acc + (cur?.distance ?? '');
        },
        '',
      );
      if (hashedDistanceUponTabFocus !== rerenderBasedOnHashedDistance) {
        setRerenderBasedOnHashedDistance(hashedDistanceUponTabFocus);
      }
    };
    const didFocusSub = navigation.addListener('didFocus', didFocusSubAction);

    debouncer.current = setTimeout(() => {
      processSearchResult();
    }, 300);

    return (): void => {
      didFocusSub.remove();
    };
  }, [
    currentFormSel<{
      searchText?: string;
    }>()?.searchText ?? '',
    rerenderBasedOnHashedDistance,
  ]);

  if (!isPanelSearchResultCollapsed) {
    return <></>;
  }

  return (
    <ScrollView style={styles.wrapper}>
      {searchResult?.slice(0, 100).map(result => (
        <TouchableOpacity
          key={result.id}
          style={styles.itemWrapper}
          onPress={(): void => {
            if (result.lat && result.long) {
              setCurrentForm({
                ...currentFormSel<CurrentMapRegion>(),
                regionCenteteredPlaceId: result.id,
                region: {
                  ...(currentFormSel<CurrentMapRegion>()?.region ?? {}),
                  latitude: parseFloat(result.lat),
                  longitude: parseFloat(result.long),
                },
              });
            }
          }}>
          <Text style={styles.name}>{result.name}</Text>
          <Divider size={20} />
          {result?.distance ?? false ? (
            <Text style={styles.address}>
              {getDistanceText(result.distance)}
            </Text>
          ) : (
            <></>
          )}
          <Text style={styles.address}>{result.address}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PanelSearchResult;
