import React, { RefObject, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { scale, primaryPalette, isNumeric } from '../../utils';
import { INavigation, PlaceDeal } from '../../..';
import IconAntd from 'react-native-vector-icons/AntDesign';
import {
  TextInputIconXL,
  ButtonShadowed,
  RightElementXSign,
  LeftWrapper,
} from '../../commons/components';
import dollarImg from '../../assets/images/icon-dollar.png';

const styles = StyleSheet.create({
  dealWrapper: {
    height: scale(240),
    padding: scale(20),
    width: '100%',
    backgroundColor: primaryPalette.light,
  },
  dealH1: {
    fontFamily: 'Avenir',
    fontSize: scale(17),
    lineHeight: scale(22),
    color: primaryPalette.dark,
    fontWeight: '800',
  },
  section1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: scale(5),
  },
  inputWrapperStyle: {
    // borderWidth: 1,
    // borderColor: 'red',
    marginTop: scale(25),
    borderBottomColor: 'rgba(44,44,44,.23)',
    borderBottomWidth: 1,
    // paddingBottom: scale(12),
  },
  inputStyle: {
    flex: 1,
    height: scale(50),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontSize: scale(16),
    lineHeight: scale(24),
  },
  iconDollar: {
    width: scale(10),
    height: scale(14),
  },
});

const IconComponentDollar = (): JSX.Element => (
  <Image style={styles.iconDollar} resizeMode="contain" source={dollarImg} />
);

interface FieldProps extends Partial<TextInputProps> {
  refInput?: RefObject<TextInput>;
  value: string;
  setValue: (text: string) => void;
  validateField?: (param: string) => boolean;
}

const RenderAmountField: React.FC<FieldProps> = ({
  value,
  setValue,
  onSubmitEditing,
  // validateField,
  refInput,
}) => {
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [rightError, setRightError] = useState('');
  // const [value, setValue] = useState('');

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
      textInputProps={{
        ref: refInput,
        style: styles.inputStyle,
        placeholderTextColor: '#bebebe',
        placeholder: 'Enter Amount',
        keyboardType: 'numeric',
        returnKeyType: 'go',
        onSubmitEditing,
        onChangeText: (text): void => {
          if (text.length === 0 || isNumeric(text)) {
            setValue(text);
          }

          // if (isFormValid !== true) {
          //   setIsFormValid(true);
          //   setRightError('');
          //   setTimeout(() => {
          //     if (refUsername.current) {
          //       ((refUsername.current || {}) as TextInput).focus();
          //     }
          //   }, 60);
          // }
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

interface EnterDealModalContentProps {
  onCloseModal: () => void;
  navigation: INavigation['navigation'];
  deal: PlaceDeal;
}

const EnterDealModalContent: React.FC<EnterDealModalContentProps> = ({
  onCloseModal,
  navigation,
  deal,
}) => {
  const [value, setValue] = useState('');

  return (
    <View style={styles.dealWrapper}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.section1}>
          <Text style={styles.dealH1}>ENTER PURCHASE AMOUNT</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onCloseModal}>
            <IconAntd name="closecircleo" size={scale(19)} />
          </TouchableOpacity>
        </View>
        <RenderAmountField
          value={value}
          setValue={(text: string): void => {
            // if (text === '85.29') {
            //   onCloseModal();
            //   navigation.navigate('CameraReceipt', {
            //     amount: text,
            //     deal: 1,
            //   })
            // }
            setValue(text);
          }}
        />
        <ButtonShadowed
          btnStyle={{}}
          onPress={(): void => {
            if (!isNumeric(value) || !deal?.id) {
              return;
            }
            onCloseModal();
            navigation.navigate('CameraReceipt', {
              amount: value,
              deal: deal,
            });
          }}
        />
      </ScrollView>
    </View>
  );
};

export default EnterDealModalContent;
