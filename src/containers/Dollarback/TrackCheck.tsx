import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getDjangoModelErrorMessage,
} from '../../utils';
import backImg from '../../assets/images/back-black.png';
import { trackCheckGET, cashOutGET } from '../../services/backend';
import { Divider } from '../../commons/components';
import { INavigation, TrackCheckItem, CashOutItem } from '../../..';
import { getUserSessionSel } from '../../state_manager/selectors';
import { WIDTH_WINDOW } from '../../utils/constants';
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
    height: scale(30),
    borderColor: 'yellow',
    fontFamily: 'Avenir',
    fontSize: scale(28),
    lineHeight: scale(42),
    fontWeight: '700',
    color: primaryPalette.dark,
  },
  earningsWrapper: {
    // padding: '10%',
    width: '90%',
    marginHorizontal: '5%',
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
  progress: {
    // paddingHorizontal: '5%',
    width: '100%',
    marginVertical: scale(5),
    // backgroundColor: 'rgba(46,46,46, 0.1)',
    borderColor: primaryPalette.light,
  },
  item: {
    width: '100%',
    marginTop: scale(15),
    padding: scale(7),
    paddingTop: scale(0),
    borderWidth: 1,
    borderRadius: scale(5),
    borderColor: 'rgba(45,45,45, 0.5)',
  },
  progressStatusText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: '#a0a0a0',
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
      <Text style={styles.headerTitle}>Track Check</Text>
    </View>
  );
};

// type TrackCheckItemStatusText = '' | 'In Revision' | 'Completed' | 'Denied';
type TrackCheckItemStatusText = '' | 'Pending' | 'Completed' | 'Rejected';
const getRevisionText = (
  status: TrackCheckItem['status'],
): TrackCheckItemStatusText => {
  let result: TrackCheckItemStatusText = '';
  if (status === 'R') {
    // result = 'In Revision';
    result = 'Pending';
  } else if (status === 'C') {
    result = 'Completed';
  } else if (status === 'D') {
    // result = 'Denied';
    result = 'Rejected';
  }

  return result;
};

type TrackCheckItemStatusProgressNum = 0 | 0.6 | 1;
const getProgressNumber = (
  status: TrackCheckItem['status'],
): TrackCheckItemStatusProgressNum => {
  let result: TrackCheckItemStatusProgressNum = 0;
  if (status === 'R') {
    result = 0.6;
  } else if (status === 'C') {
    result = 1;
  } else if (status === 'D') {
    result = 1;
  }

  return result;
};

const RenderItems: React.FC<{
  items: TrackCheckItem[];
  cashOutItems: CashOutItem[];
}> = ({ cashOutItems }) => {
  return (
    <>
      {cashOutItems.map(item => {
        const revisionText = getRevisionText(item.status),
          progress = getProgressNumber(item.status);

        return (
          <View key={item.id} style={styles.item}>
            <Text style={styles.h3}>
              Cash Out ${item.amount?.toLocaleLowerCase()}
            </Text>
            <Progress.Bar
              width={WIDTH_WINDOW}
              style={styles.progress}
              height={scale(9)}
              progress={progress}
              unfilledColor="rgba(46,46,46, 0.1)"
              color={item.status === 'D' ? primaryPalette.orange : '#89DEA0'}
            />
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.progressStatusText}>{revisionText}</Text>
              {/* <Text style={styles.progressStatusText}>Complete</Text> */}
            </View>
          </View>
        );
      })}
    </>
  );
};

type TrackCheckProps = INavigation<{
  trackCheckItems: TrackCheckItem[];
  cashOutItems: CashOutItem[];
}>;

const TrackCheck: React.FC<TrackCheckProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [trackCheckItems, setTrackCheckItems] = useState<TrackCheckItem[]>(
    navigation.getParam('trackCheckItems'),
  );
  const [cashOutItems, setCashOutItems] = useState<CashOutItem[]>(
    navigation.getParam('cashOutItems'),
  );
  const timer1 = useRef((null as unknown) as typeof setTimeout);

  const asyncDidMount = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await trackCheckGET({
        query: {
          user: getUserSessionSel().user.id,
        },
      });
      if (Array.isArray(res)) {
        setTrackCheckItems(res);
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
        // asyncDidMount();
      }, 300);
    });

    return (): void => {
      if (timer1.current) {
        clearTimeout(timer1.current);
      }
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <RenderHeader navigation={navigation} />
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
        contentInset={{
          top: scale(40),
          bottom: scale(40),
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={(): void => {
              asyncDidMount();
            }}
          />
        }>
        <View style={styles.earningsWrapper}>
          <RenderItems items={trackCheckItems} cashOutItems={cashOutItems} />
        </View>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: scale(180),
            height: scale(40),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: scale(10),
            marginBottom: scale(40),
          }}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: '100%',
              textAlign: 'center',
              fontFamily: 'Avenir',
              fontSize: scale(16),
              lineHeight: scale(22),
              fontWeight: '400',
              color: primaryPalette.blue,
            }}>
            Send an email to us?
          </Text>
        </TouchableOpacity>
        <Divider size={20} />
      </ScrollView>
    </View>
  );
};

TrackCheck.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default TrackCheck;
