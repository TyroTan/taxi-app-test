import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  TextInput,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { GoogleLocationResult } from 'react-native-google-autocomplete/dist/services/Google.service';
import { scale, primaryPalette, getStatusBarHeight } from '../../utils';
import backImg from '../../assets/images/back-black.png';
import { INavigation } from '../../..';
import { NavigationStackOptions } from 'react-navigation-stack';
import { useGlobal } from 'reactn';
import { currentFormSel } from '../../state_manager/selectors';

interface LocationItemProps extends GoogleLocationResult {
  navigation: INavigation['navigation'];
}

const LocationItem: React.FC<LocationItemProps> = props => {
  const [, setCurrentForm] = useGlobal('currentForm');
  return (
    <TouchableOpacity
      onPress={(): void => {
        setCurrentForm({
          ...currentFormSel(),
          address: props.description,
        });

        props.navigation.goBack();
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderBottomColor: 'rgba(44,44,44,.23)',
        borderBottomWidth: 1,
      }}>
      <Text
        numberOfLines={2}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: '90%',
          flex: 1,
          lineHeight: scale(23),
          fontFamily: 'Avenir',
          color: primaryPalette.dark,
          fontSize: scale(16),
          marginVertical: scale(15),
          marginBottom: scale(20),
          // lineHeight: scale(21),
        }}>
        {props.description}
      </Text>
    </TouchableOpacity>
  );
};

const AddressAutoComplete: React.FC<INavigation> = ({ navigation }) => {
  return (
    <GoogleAutoComplete
      components="country:us"
      apiKey={GOOGLE_MAPS_API_KEY}
      debounce={300}>
      {({
        inputValue,
        handleTextChange,
        locationResults,
        fetchDetails,
      }): JSX.Element => (
        <React.Fragment>
          <TextInput
            autoFocus
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: scale(40),
              // width: 300,
              // borderWidth: 1,
              paddingHorizontal: 16,
            }}
            value={inputValue}
            onChangeText={handleTextChange}
            placeholder="Type to search.."
          />
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{ maxHeight: scale(250), paddingHorizontal: scale(20) }}>
            {locationResults.map((el, i) => (
              <LocationItem
                {...el}
                fetchDetails={fetchDetails}
                key={String(i)}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        </React.Fragment>
      )}
    </GoogleAutoComplete>
  );
};

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
      <Text style={styles.headerTitle}>Address</Text>
    </View>
  );
};

const AddressAutoCompleteForm: React.FC<INavigation> = ({ navigation }) => {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <RenderHeader navigation={navigation} />
      <AddressAutoComplete navigation={navigation} />
    </View>
  );
};

AddressAutoCompleteForm.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default AddressAutoCompleteForm;

// export default AddressAutoComplete;
