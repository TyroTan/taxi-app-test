import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  RefreshControl,
  InteractionManager,
  StatusBar,
  Alert,
} from 'react-native';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getDjangoModelErrorMessage,
} from '../../utils';
import backImg from '../../assets/images/back-black.png';
import earningsBGImg from '../../assets/images/earnings-bg.png';
import { earningsGET, trackCheckGET, cashOutGET } from '../../services/backend';
import { Divider } from '../../commons/components';
import {
  getUserSessionSel,
  currentNavigationPopupMessageSel,
} from '../../state_manager/selectors';
import { INavigation, TrackCheckItem, CashOutItem } from '../../..';
import { useGlobal } from 'reactn';
import { NavigationStackOptions } from 'react-navigation-stack';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: getStatusBarHeight(true) + scale(5),
  },
  header: {
    // height: scale(50),
    flexDirection: 'column',
    padding: scale(10),
    marginBottom: scale(10),
  },
  headerBackBtn: {
    height: scale(32),
    width: scale(32),
    paddingVertical: scale(5),
    marginLeft: scale(-3),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerBackImg: {
    height: scale(22),
    width: scale(22),
  },
  headerTitle: {
    // height: scale(30),
    fontFamily: 'Avenir',
    fontSize: scale(28),
    lineHeight: scale(42),
    fontWeight: '700',
    color: primaryPalette.dark,
  },
  earningsWrapper: {
    // padding: '10%',
    marginHorizontal: '10%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsBGImg: {
    height: scale(100),
    width: '100%',
  },
  h3: {
    paddingTop: scale(10),
    fontFamily: 'Avenir',
    fontSize: scale(20),
    lineHeight: scale(26),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  h3Value: {
    fontFamily: 'Avenir',
    fontSize: scale(35),
    lineHeight: scale(48),
    fontWeight: '600',
    color: primaryPalette.orangeLight,
  },
  footer: {
    // height: scale(150),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftBtnError: {
    backgroundColor: primaryPalette.light,
    borderColor: 'red',
    borderWidth: scale(2),
  },
  leftBtnTextError: {
    color: 'red',
  },
  leftBtn: {
    flex: 1,
    width: '80%',
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: primaryPalette.blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(20),
  },
  leftBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.light,
  },
  rightBtn: {
    flex: 1,
    width: '80%',
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: primaryPalette.orange,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(20),
  },
  rightBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.light,
  },
});

const RenderHeader: React.FC<{ navigation: INavigation['navigation'] }> = ({
  navigation,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={(): void => {
          navigation.goBack();
        }}
        style={styles.headerBackBtn}>
        <Image
          source={backImg}
          resizeMode="contain"
          style={styles.headerBackImg}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Dollarback</Text>
    </View>
  );
};

const DollarbackEarning: React.FC<INavigation> = ({ navigation }) => {
  const [, setCrrentNavigationPopupMessage] = useGlobal(
    'currentNavigationPopupMessage',
  );
  const [loading, setLoading] = useState(false);
  const [availableEarnings, setAvailableEarnings] = useState('$0');
  const [availableEarningsNumber, setAvailableEarningsNumber] = useState(0);
  const [trackCheckItems, setTrackCheckItems] = useState<TrackCheckItem[]>([]);
  const [cashOutItems, setCashOutItems] = useState<CashOutItem[]>([]);
  const [cashOutError, setCashOutError] = useState<boolean>(false);
  const timer1 = useRef((null as unknown) as typeof setTimeout);
  const asyncDidMount = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await earningsGET();
      if (res?.available_earnings ?? '') {
        setAvailableEarnings(res.available_earnings);
        setAvailableEarningsNumber(res.available_earnings_numeric);
      }
      const res2 = await trackCheckGET({
        query: {
          user: getUserSessionSel().user.id,
        },
      });
      if (Array.isArray(res2)) {
        setTrackCheckItems(res2);
      }
      const res3 = await cashOutGET({
        query: {
          user: getUserSessionSel().user.id,
        },
      });

      if (Array.isArray(res3)) {
        setCashOutItems(res3);
      }
    } catch (e) {
      const msg = getDjangoModelErrorMessage(e);
      console.log('earningsGET e', e, msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (timer1?.current ?? false) {
        clearTimeout(timer1.current);
      }

      timer1.current = setTimeout(() => {
        asyncDidMount();
      }, 300);
    });

    const unsubscribe = navigation.addListener('didFocus', () => {
      if (currentNavigationPopupMessageSel()) {
        asyncDidMount();
        Alert.alert(currentNavigationPopupMessageSel());
        setCrrentNavigationPopupMessage('');
      }
    });

    return (): void => {
      unsubscribe.remove();
      if (timer1.current) {
        clearTimeout(timer1.current);
      }
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <RenderHeader navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={(): void => {
              asyncDidMount();
            }}
          />
        }>
        <ImageBackground
          resizeMode="contain"
          style={styles.earningsWrapper}
          source={earningsBGImg}
          imageStyle={styles.earningsBGImg}>
          <Text style={styles.h3}>Your earnings</Text>
          {
            // loading ?
            // <ActivityIndicator size='large' /> :
            <Text style={styles.h3Value}>{availableEarnings}</Text>
          }
        </ImageBackground>
        <View>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <Divider size={50} wrapperStyle={{ flex: 0 }} />
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.leftBtn, cashOutError ? styles.leftBtnError : {}]}
              onPress={(): void => {
                const earnings = availableEarningsNumber;
                if (earnings <= 0) {
                  setCashOutError(true);
                  setTimeout((): void => {
                    setCashOutError(false);
                  }, 800);
                  return;
                }

                navigation.navigate('CashOut', {
                  availableEarnings: earnings,
                });
              }}>
              <Text
                style={[
                  styles.leftBtnText,
                  cashOutError ? styles.leftBtnTextError : {},
                ]}>
                Cash Out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightBtn}
              onPress={(): void => {
                navigation.navigate('TrackCheck', {
                  trackCheckItems,
                  cashOutItems,
                });
              }}>
              <Text style={styles.rightBtnText}>Track Check</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

DollarbackEarning.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default DollarbackEarning;
