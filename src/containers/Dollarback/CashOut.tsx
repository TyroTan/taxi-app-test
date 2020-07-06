import React, { useEffect, useState, useRef, RefObject } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInputProps,
  TextInput,
  Alert,
  Picker,
} from 'react-native';
import {
  scale,
  primaryPalette,
  getStatusBarHeight,
  getDjangoModelErrorMessage,
  isNumeric,
  formatSSN,
} from '../../utils';
import backImg from '../../assets/images/back-black.png';
import iconPersonImg from '../../assets/images/icon-person.png';
import iconCardImg from '../../assets/images/icon-card.png';
import iconPinImg from '../../assets/images/icon-pin-grey.png';
import iconDollarImg from '../../assets/images/icon-dollar.png';
import {
  Divider,
  TextInputIconXL,
  ButtonShadowed,
  RightElementXSign,
  LeftWrapper,
} from '../../commons/components';
import {
  INavigation,
  TrackCheckItem,
  CashOutItem,
  CashOutPOSTData,
} from '../../..';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGlobal } from 'reactn';
import {
  currentFormSel,
  getUserSessionSel,
} from '../../state_manager/selectors';
import { cashOutPOST } from '../../services/backend';
import USA_STATES from '../../utils/us-states';
import Modal from 'react-native-modal';
import { NavigationStackOptions } from 'react-navigation-stack';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: getStatusBarHeight(true) + scale(5),
  },
  body: {
    marginHorizontal: scale(22),
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
  h4: {
    paddingTop: scale(10),
    paddingHorizontal: scale(15),
    fontFamily: 'Avenir',
    fontSize: scale(16),
    lineHeight: scale(20),
    fontWeight: '300',
    color: primaryPalette.dark,
  },
  footer: {
    marginTop: scale(30),
    // height: scale(150),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  submitBtn: {
    height: scale(56),
    width: scale(170),
    borderRadius: scale(32),
    backgroundColor: primaryPalette.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: scale(17),
    lineHeight: scale(22),
    fontWeight: '400',
    color: primaryPalette.light,
  },

  inputWrapperStyle: {
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
  },
  inputStyle: {
    flex: 1,
    height: scale(73),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(21),
  },
  iconPersonImg: {
    width: scale(18),
    height: scale(18),
  },
  iconCardImg: {
    width: scale(21),
    height: scale(21),
  },
  iconPinImg: {
    width: scale(21),
    height: scale(21),
  },
  iconDollarImg: {
    width: scale(16),
    height: scale(16),
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
      <Text style={styles.headerTitle}>Cash Out</Text>
    </View>
  );
};

const IconComponentPerson: React.FC = () => (
  <Image
    style={styles.iconPersonImg}
    resizeMode="stretch"
    source={iconPersonImg}
  />
);

const IconComponentCard: React.FC = () => (
  <Image style={styles.iconCardImg} resizeMode="contain" source={iconCardImg} />
);

const IconComponentPin: React.FC = () => (
  <Image style={styles.iconPinImg} resizeMode="contain" source={iconPinImg} />
);

const IconComponentDollar = (): JSX.Element => (
  <Image
    style={styles.iconDollarImg}
    resizeMode="contain"
    source={iconDollarImg}
  />
);

interface CashOutForm {
  firstName: string;
  lastName: string;
  ssn: string;
  address: string;
  state: string;
}

interface FieldProps extends INavigation, Partial<TextInputProps> {
  refInput?: RefObject<TextInput>;
  validateField?: (param: string) => boolean;
}

const RenderNameField: React.FC<FieldProps> = ({
  onSubmitEditing,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return props_.length === 0;
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'Name',
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          setCurrentForm({
            ...currentFormSel(),
            first_name: text,
          });
          setValue(text);
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <LeftWrapper>
          <IconComponentPerson />
        </LeftWrapper>
      )}
    />
  );
};

const RenderLastNameField: React.FC<FieldProps> = ({
  onSubmitEditing,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return props_.length === 0;
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'Last Name',
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          setCurrentForm({
            ...currentFormSel(),
            last_name: text,
          });
          setValue(text);
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <LeftWrapper>
          <IconComponentPerson />
        </LeftWrapper>
      )}
    />
  );
};

const RenderSSNField: React.FC<FieldProps> = ({
  onSubmitEditing,
  validateField,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [value, setValue] = useState('');

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      rightElementCondition={(props: any): boolean => {
        return !validateField?.(props);
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'SSN',
        returnKeyType: 'next',
        // keyboardType: 'phone-pad',
        onSubmitEditing,
        onChangeText: (text): void => {
          setCurrentForm({
            ...currentFormSel(),
            ssn: formatSSN(text, value),
          });
          setValue(formatSSN(text, value));
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <LeftWrapper>
          <IconComponentCard />
        </LeftWrapper>
      )}
    />
  );
};

const RenderAddressField: React.FC<FieldProps> = ({
  navigation,
  onSubmitEditing,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  // console.log('currentFormSelcurrentFormSel', currentFormSel().address);
  const [value, setValue] = useState(currentFormSel()?.address ?? 'Address');

  useEffect(() => {
    const navSub = navigation.addListener('didFocus', () => {
      setValue(currentFormSel()?.address ?? 'Address');
    });

    return (): void => {
      navSub.remove();
    };
  }, []);
  /*
  if (value || !value) {
    return (
      <TouchableOpacity
        style={[
          styles.inputWrapperStyle,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
        onPress={(): void => {
          navigation.navigate('AddressAutoComplete');
        }}>
        <LeftWrapper>
          <IconComponentPin />
        </LeftWrapper>
        <Text
          {...{
            style: [
              styles.inputStyle,
              { lineHeight: scale(73), color: '#bebebe' },
            ],
          }}>
          Address
        </Text>
      </TouchableOpacity>
    );
  }
  */

  return (
    <TouchableOpacity
      onPress={(): void => {
        navigation.navigate('AddressAutoComplete');
      }}>
      <TextInputIconXL
        // isValid={isFormValid}
        // rightError={rightError}
        rightElementCondition={(props: any): boolean => {
          return props.length === 0;
        }}
        rightElement={RightElementXSign}
        wrapperStyle={styles.inputWrapperStyle}
        textInputProps={{
          ref: refInput,
          editable: false,
          style: styles.inputStyle,
          placeholderTextColor: '#bebebe',
          placeholder: value ?? 'Address',
          returnKeyType: 'next',
          // keyboardType: 'phone-pad',
          onSubmitEditing,
          onChangeText: (text): void => {
            setCurrentForm({
              ...currentFormSel(),
              address: text,
            });
            setValue(text);
          },
          value,
        }}
        leftIcon={(): JSX.Element => (
          <LeftWrapper>
            <IconComponentPin />
          </LeftWrapper>
        )}
      />
    </TouchableOpacity>
  );
};

const RenderStateField: React.FC<FieldProps> = ({
  onSubmitEditing,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  const [, setCurrentForm] = useGlobal('currentForm');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <View>
      <Modal
        onBackdropPress={(): void => {
          setIsPickerOpen(false);
        }}
        isVisible={isPickerOpen}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            height: scale(300),
            alignSelf: 'center',
            backgroundColor: primaryPalette.light,
          }}>
          <Picker
            selectedValue={value}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              height: '70%',
              width: '100%',
              marginVertical: scale(10),
            }}
            onValueChange={(itemValue): void => {
              setCurrentForm({
                ...currentFormSel(),
                state: itemValue,
              });
              setValue(itemValue);
            }}>
            {Object.keys(USA_STATES).map(key => (
              <Picker.Item
                key={key}
                label={USA_STATES[key]}
                value={USA_STATES[key]}
              />
            ))}
          </Picker>
          <ButtonShadowed
            onPress={(): void => {
              setIsPickerOpen(false);
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            btnStyle={{ alignSelf: 'center', marginTop: 0 }}
          />
        </View>
      </Modal>
      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={(): void => {
          setIsPickerOpen(true);
        }}>
        <TextInputIconXL
          // isValid={isFormValid}
          // rightError={rightError}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rightElementCondition={(props_: any): boolean => {
            return props_.length === 0;
          }}
          rightElement={RightElementXSign}
          wrapperStyle={styles.inputWrapperStyle}
          textInputProps={{
            ref: refInput,
            style: styles.inputStyle,
            placeholderTextColor: '#bebebe',
            placeholder: 'State',
            returnKeyType: 'send',
            // keyboardType: 'phone-pad',
            onSubmitEditing,
            onFocus: (): void => {
              refInput?.current?.blur();
            },
            onBlur: (): void => {
              setIsPickerOpen(true);
            },
            onChangeText: (text): void => {
              setCurrentForm({
                ...currentFormSel(),
                state: text,
              });
              setValue(text);
            },
            value,
          }}
          leftIcon={(): JSX.Element => (
            <LeftWrapper>
              <IconComponentPin />
            </LeftWrapper>
          )}
        />
      </TouchableOpacity>
    </View>
  );
};

const RenderAmountField: React.FC<FieldProps> = ({
  onSubmitEditing,
  refInput,
  value,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentForm] = useGlobal('currentForm');
  // const [valueAmount, setValueAmou] = useState(value);

  return (
    <TextInputIconXL
      // isValid={isFormValid}
      // rightError={rightError}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rightElementCondition={(props_: any): boolean => {
        return !isNumeric(props_);
      }}
      rightElement={RightElementXSign}
      wrapperStyle={styles.inputWrapperStyle}
      _forceTextInput={true}
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        editable: false,
        placeholderTextColor: '#bebebe',
        placeholder: 'Amount',
        keyboardType: 'numeric',
        returnKeyType: 'send',
        onSubmitEditing,
        onChangeText: (): void => {
          // setCurrentForm({
          //   ...currentFormSel(),
          //   amount: text
          // });
          // setValue(text)
        },
        value,
      }}
      leftIcon={(): JSX.Element => (
        <LeftWrapper>
          <IconComponentDollar />
        </LeftWrapper>
      )}
    />
  );
};

type TrackCheckProps = INavigation<{
  trackCheckItems: TrackCheckItem[];
  cashOutItems: CashOutItem[];
  availableEarnings: number;
}>;

const CashOut: React.FC<TrackCheckProps> = props => {
  const { navigation } = props;
  const [loading, setLoading] = useState(false);
  const [, setCrrentNavigationPopupMessage] = useGlobal(
    'currentNavigationPopupMessage',
  );
  // const [name, setName] = useState('');
  const refLastName = useRef<TextInput>(null);
  const refSSN = useRef<TextInput>(null);
  const refAddress = useRef<TextInput>(null);
  const refState = useRef<TextInput>(null);
  const refAmount = useRef<TextInput>(null);
  const availableEarnings = navigation.getParam('availableEarnings');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateName: <P>(p: P) => boolean = (p_: any) => {
    return p_.length > 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateSSN: <P>(p: P) => boolean = (p_: any) => {
    return p_.length === 11;
  };

  const validCashoutForm = (): boolean => {
    const formData = currentFormSel() as CashOutPOSTData;

    return !!(
      formData.first_name &&
      formData.last_name &&
      formData.ssn &&
      formData.address &&
      formData.state
    );
    // && isNumeric(formData.amount);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      if (loading) return;
      // console.log('validCashoutForm()', validCashoutForm());
      if (!validCashoutForm()) {
        return;
      }

      setLoading(true);
      const formData = currentFormSel() as CashOutPOSTData;
      const res = await cashOutPOST({
        data: {
          user: getUserSessionSel().user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          ssn: formData.ssn,
          address: formData.address,
          state: formData.state,
          amount: availableEarnings,
        },
      });
      if (res && res.user) {
        setCrrentNavigationPopupMessage(
          res?.message ?? 'Thank you, we have received your cash out.',
        );
        props.navigation.navigate('DollarbackEarning', {
          state: {
            cashOutPostMsg:
              res?.message ?? 'Thank you, we have received your cash out.',
          },
        });
      }
    } catch (e) {
      const msg = getDjangoModelErrorMessage(e);
      console.log('cashOutPOST e', msg, e);
      Alert.alert(e);
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <RenderHeader navigation={navigation} />
      <Text style={styles.h4}>Send me a check</Text>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.body}>
        <RenderNameField
          autoFocus
          validateField={validateName}
          {...props}
          onSubmitEditing={(): void => {
            refLastName?.current?.focus?.();
          }}
        />
        <RenderLastNameField
          refInput={refLastName}
          validateField={validateName}
          {...props}
          onSubmitEditing={(): void => {
            refSSN?.current?.focus?.();
          }}
        />
        <RenderSSNField
          refInput={refSSN}
          validateField={validateSSN}
          {...props}
          onSubmitEditing={(): void => {
            // refAddress?.current?.focus?.();
            navigation.navigate('AddressAutoComplete');
          }}
        />
        <RenderAddressField
          refInput={refAddress}
          validateField={validateName}
          {...props}
          onSubmitEditing={(): void => {
            refState?.current?.focus?.();
          }}
        />
        <RenderStateField
          refInput={refState}
          validateField={validateName}
          {...props}
          onSubmitEditing={(): void => {
            // refAmount?.current?.focus?.()
            onSubmit();
          }}
        />
        <RenderAmountField
          value={'' + availableEarnings}
          refInput={refAmount}
          // validateField={validateName}
          {...props}
          // onSubmitEditing={(): void => {
          // onSubmit()
          // }}
        />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color={primaryPalette.light} />
            ) : (
              <Text style={styles.submitBtnText}>Submit</Text>
            )}
          </TouchableOpacity>
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
                fontSize: scale(18),
                lineHeight: scale(24),
                fontWeight: '400',
                color: primaryPalette.blue,
              }}>
              Send an email to us?
            </Text>
          </TouchableOpacity>
        </View>
        <Divider size={20} />
      </KeyboardAwareScrollView>
    </View>
  );
};

CashOut.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default CashOut;
