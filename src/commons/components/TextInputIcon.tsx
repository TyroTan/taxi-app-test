import React, { FC } from 'react';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import { Image } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { sizeM } from '../styles';
import { scale } from '../../utils';

interface IWithRef {
  ref?: React.RefObject<TextInput>;
}
interface ITextInputIcon {
  textInputProps: TextInputProps & IWithRef;

  leftIcon?:
    | React.ReactNode
    | React.FC
    | (() => JSX.Element | React.ReactElement);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  leftIconProps?: any;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  iconProps?: any;
  icon?: React.FC;
  isValid?: boolean;
  rightElementCondition?: <R>(props: R) => boolean;
  rightElement?: React.FC;
  // rightElement?:
  // | string
  // | React.ReactNode
  // | React.FC
  // | (() => JSX.Element | React.ReactElement);
  // rightElementProps?: any;

  style?: TextStyle;
  wrapperProps?: ViewProps;
  wrapperStyle?: ViewStyle;
  _forceTextInput?: boolean;
}

interface ITextInputIconXLProps {
  textInputProps: TextInputProps & IWithRef;

  leftIcon?:
    | React.ReactNode
    | React.FC
    | (() => JSX.Element | React.ReactElement);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  leftIconProps?: any;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  iconProps?: any;
  icon?: React.FC;
  isValid?: boolean;
  rightElementCondition?: <R>(props: R) => boolean;
  rightElement?: React.FC | null;
  // rightElement?:
  // | string
  // | React.ReactNode
  // | React.FC
  // | (() => JSX.Element | React.ReactElement);
  // rightElementProps?: any;
  wrapperProps?: ViewProps;
  wrapperStyle?: ViewStyle;
  _forceTextInput?: boolean;
}

const styleOnError = StyleSheet.create({
  textInput: {
    color: 'red',
  },
  rightText: {
    color: 'red',
    textAlign: 'right',
    fontSize: sizeM,
  },
});

const RenderLeftIcon: React.FC<{
  leftIcon:
    | React.ReactNode
    | React.FC
    | (() => JSX.Element | React.ReactElement);
}> = ({ leftIcon }) => {
  if (!leftIcon) return <></>;

  const LeftIconFC = leftIcon as React.FC;

  // if (leftIconProps) {
  //   return <LeftIconFC {...leftIconProps} />;
  // }

  return <LeftIconFC />;
};

const RenderRightElement: React.FC<Pick<
  ITextInputIcon,
  'textInputProps' | 'rightElement' | 'rightElementCondition'
>> = ({ rightElement, textInputProps, rightElementCondition }) => {
  const RightElement = rightElement as React.FC;
  const Empty: React.FC = () => <></>;

  if (
    typeof rightElementCondition === 'undefined' &&
    typeof RightElement !== 'undefined'
  ) {
    return <RightElement />;
  }

  return rightElementCondition?.(textInputProps.value) ? (
    <RightElement />
  ) : (
    <Empty />
  );
};

const TextInputIcon: React.FC<ITextInputIcon> = ({
  // leftIconProps,
  leftIcon,
  textInputProps,
  // iconProps,
  // icon,
  isValid,
  rightElement = (): JSX.Element => <></>,
  rightElementCondition = (): boolean => true,
  // rightElementProps = null,
  // style,
  wrapperStyle,
  wrapperProps = {},
  _forceTextInput = false,
}) => {
  // const LeftIcon = leftIcon ? leftIcon : (): JSX.Element => <></>;

  const conditionalTextInputStyle =
    isValid === false ? styleOnError.textInput : {};
  const mergedTextInputProps = {
    ...textInputProps,
    style: {
      ...(textInputProps.style as object),
      ...conditionalTextInputStyle,
    },
  };

  textInputProps.editable = textInputProps?.editable ?? true;
  let textLineHeight = 0,
    mergedTextProps = mergedTextInputProps;
  const textColor = mergedTextProps?.placeholderTextColor;
  if (textInputProps.editable === false) {
    textLineHeight = ((textInputProps?.style as TextStyle)?.height ??
      0) as number;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      placeholderTextColor,
      ...mergedTextPropsRest
    } = mergedTextInputProps;

    mergedTextProps = {
      ...mergedTextPropsRest,
      style: {
        ...(mergedTextProps.style ?? {}),
        ...(textLineHeight ? { lineHeight: textLineHeight as number } : {}),
        color: textColor,
      },
    };
  }

  // <View
  //         style={{
  //           flex: 1,
  //           justifyContent: 'flex-start',
  //           flexDirection: 'row',
  //         }}>
  //         <TextInput {...{ ...noValue }}>+1</TextInput>
  //         <TextInput {...mergedTextInputProps} />
  //       </View>

  return (
    <View
      {...wrapperProps}
      style={[
        wrapperStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // paddingRight: scale(22),
        },
      ]}>
      <RenderLeftIcon leftIcon={leftIcon} />
      {textInputProps?.editable === true ? (
        <TextInput {...mergedTextInputProps} />
      ) : _forceTextInput ? (
        <TextInput {...mergedTextInputProps} />
      ) : (
        <Text {...mergedTextProps}>
          {mergedTextProps.value ?? mergedTextProps.placeholder}
        </Text>
      )}
      <RenderRightElement
        rightElement={rightElement}
        textInputProps={textInputProps}
        rightElementCondition={rightElementCondition}
      />
    </View>
  );
};

const TextInputIconXL: React.FC<ITextInputIconXLProps> = ({
  leftIcon,
  leftIconProps,
  textInputProps,
  icon,
  iconProps,
  isValid,
  rightElementCondition,
  rightElement,
  // rightElementProps,
  wrapperProps,
  wrapperStyle,
  _forceTextInput,
}) => {
  const settingsIconProps = {
    size: 35,
    ...iconProps,
  };

  const style = (textInputProps.style ? textInputProps.style : {}) as TextStyle;

  const settingsTextInputProps = {
    ...textInputProps,
    style: { /*...styles.textInput, ...styles.textInputXL,*/ ...style },
  };

  return (
    <TextInputIcon
      // style={{ ...styles.textInputWrapperSmall }}
      wrapperProps={wrapperProps}
      wrapperStyle={wrapperStyle}
      _forceTextInput={_forceTextInput}
      leftIcon={leftIcon}
      leftIconProps={leftIconProps}
      textInputProps={settingsTextInputProps}
      icon={icon}
      isValid={isValid}
      rightElement={rightElement}
      rightElementCondition={rightElementCondition}
      // rightElementProps={rightElementProps}
      iconProps={settingsIconProps}
    />
  );
};

interface TextInputIconWithPrefixProps extends ITextInputIconXLProps {
  prefix: string;
}

const TextInputIconWithPrefix: React.FC<TextInputIconWithPrefixProps> = ({
  leftIcon,
  // leftIconProps,
  textInputProps,
  // icon,
  // iconProps,
  isValid,
  rightElementCondition,
  rightElement,
  prefix,
  wrapperProps,
  wrapperStyle,
  // _forceTextInput,
}) => {
  const conditionalTextInputStyle =
    isValid === false ? styleOnError.textInput : {};
  const mergedTextInputProps = {
    ...textInputProps,
    style: {
      ...(textInputProps.style as object),
      ...conditionalTextInputStyle,
    },
  };

  textInputProps.editable = textInputProps?.editable ?? true;
  let textLineHeight = 0,
    mergedTextProps = mergedTextInputProps;
  const textColor = mergedTextProps?.placeholderTextColor;
  if (textInputProps.editable === false) {
    textLineHeight = ((textInputProps?.style as TextStyle)?.height ??
      0) as number;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      placeholderTextColor,
      ...mergedTextPropsRest
    } = mergedTextInputProps;

    mergedTextProps = {
      ...mergedTextPropsRest,
      style: {
        ...(mergedTextProps.style ?? {}),
        ...(textLineHeight ? { lineHeight: textLineHeight as number } : {}),
        color: textColor,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, ...noValue } = mergedTextInputProps;

  return (
    <View
      {...wrapperProps}
      style={[
        wrapperStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // paddingRight: scale(22),
        },
      ]}>
      <RenderLeftIcon leftIcon={leftIcon} />
      {prefix?.length > 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <TextInput
            {...{
              ...noValue,
              flex: 0,
              editable: false,
              // borderWidth: 1,
              width: scale(24),
            }}>
            {prefix}
          </TextInput>
          <TextInput {...{ ...mergedTextInputProps }} />
        </View>
      ) : (
        <Text {...mergedTextProps}>
          {mergedTextProps.value ?? mergedTextProps.placeholder}
        </Text>
      )}
      <RenderRightElement
        rightElement={rightElement as FC<{}> | undefined}
        textInputProps={textInputProps}
        rightElementCondition={rightElementCondition}
      />
    </View>
  );
};

export default TextInputIcon;
export { TextInputIconXL, TextInputIconWithPrefix };
