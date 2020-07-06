import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  ImageStyle,
  Image,
  TextStyle,
  ListRenderItemInfo,
} from 'react-native';
import { INavigation } from '../../..';
import { getStatusBarHeight, scale, primaryPalette } from '../../utils';
import dummyDeal from '../../assets/images/dummy-deal.png';
import moreImg from '../../assets/images/more.png';
import { ButtonFloatingSubmit } from '../../commons/components';
import { getBottomSpace } from 'react-native-iphone-x-helper';

interface EnterDealStyles {
  wrapper: ViewStyle;
  content: ViewStyle;
  listItemWrapper: ViewStyle;
  listItemLeft: ViewStyle;
  listItemCenter: ViewStyle;
  listItemRight: ViewStyle;
  listItemImg: ImageStyle;
  listItemTitle: TextStyle;
  listItemBtn: ViewStyle;
  listItemBtnText: TextStyle;
  listItemMoreBtn: ViewStyle;
  listItemMoreImg: ImageStyle;
}

const styles = StyleSheet.create<EnterDealStyles>({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(true),
  },
  content: {
    flex: 1,
  },
  listItemWrapper: {
    flex: 1,
    marginHorizontal: scale(18),
    paddingBottom: scale(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  listItemLeft: {
    width: scale(95),
    flexDirection: 'row',
    paddingTop: scale(20),
  },
  listItemCenter: {
    // borderWidth:1,
    width: '68%',
    // padding: scale(20)
    paddingHorizontal: scale(20),
    paddingTop: scale(30),
    // paddingBottom: scale(30)
  },
  listItemRight: {
    // borderWidth:1,
    // width: '4%',
    // paddingRight: scale(10),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listItemImg: {
    height: scale(95),
    width: scale(95),
  },
  listItemTitle: {
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(26),
    lineHeight: scale(32),
    fontWeight: '500',
  },
  listItemBtn: {
    marginTop: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(36),
    width: scale(95),
    borderRadius: scale(30),
    borderWidth: scale(1),
    borderColor: '#f18f01',
  },
  listItemBtnText: {
    color: '#f18f01',
    fontFamily: 'Avenir',
    fontSize: scale(15),
    lineHeight: scale(20),
    fontWeight: '500',
  },
  listItemMoreBtn: {
    marginTop: scale(30),
    padding: scale(5),
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemMoreImg: {
    height: scale(20),
    width: scale(20),
  },
});

interface DealItem {
  num: number;
}

const RenderListItem: React.FC<ListRenderItemInfo<DealItem>> = ({ index }) => {
  return (
    <View style={styles.listItemWrapper}>
      <View style={styles.listItemLeft}>
        <Image
          resizeMode="contain"
          source={dummyDeal}
          style={styles.listItemImg}
        />
      </View>
      <View style={styles.listItemCenter}>
        <Text numberOfLines={3} style={styles.listItemTitle}>
          Deals {index}
        </Text>
        {/* Deals 1Deals 1Deals1Deals11Deals1Deals1Deals11Deals 1Deals1Deals11Deals */}
        <TouchableOpacity style={styles.listItemBtn}>
          <Text style={styles.listItemBtnText}>Stop</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listItemRight}>
        <TouchableOpacity style={styles.listItemMoreBtn}>
          <Image
            resizeMode="contain"
            source={moreImg}
            style={styles.listItemMoreImg}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RenderContent: React.FC<INavigation> = () => {
  return (
    <View style={styles.wrapper}>
      <FlatList
        contentInset={{ bottom: scale(10) }}
        renderItem={RenderListItem}
        data={[
          { num: 0 },
          { num: 1 },
          { num: 2 },
          { num: 3 },
          { num: 4 },
          { num: 5 },
        ]}
      />
      <ButtonFloatingSubmit
        btnStyle={{
          margin: getBottomSpace(),
        }}
        onPress={(): void => {
          return;
        }}
      />
    </View>
  );
};

const ListDeals: React.FC<INavigation> = props => {
  return (
    <View style={styles.wrapper}>
      <RenderContent {...props} />
    </View>
  );
};

export default ListDeals;
