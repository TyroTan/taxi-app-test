import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Image, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {
  INavigation,
  PlaceDeal,
  CameraTakePicture,
  CheckPostData,
} from '../../..';
import { scale, primaryPalette, getCaughtAxiosErrorObj } from '../../utils';
import { ButtonShadowed } from '../../commons/components';
import { useState } from 'reactn';
import { checksPOST } from '../../services/backend';
import { getUserSessionSel } from '../../state_manager/selectors';
import { ERROR_500_MSG, WIDTH_WINDOW } from '../../utils/constants';
import cameraShutterImg from '../../assets/images/camera-shutter.png';
import cameraRetakeImg from '../../assets/images/camera-retake.png';
import { NavigationStackOptions } from 'react-navigation-stack';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: scale(15),
    paddingHorizontal: scale(20),
    alignSelf: 'center',
    margin: scale(20),
  },
});

const PendingView: React.FC = () => (
  <View
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const RenderCameraIcon: React.FC = () => {
  // return <MaterialIcon color="#FFF" name="photo-camera" size={scale(30)} />
  return (
    <Image
      source={cameraShutterImg}
      resizeMode="contain"
      style={{ width: scale(86) }}
    />
  );
};

const RenderCameraRetakeIcon: React.FC = () => {
  // return <MaterialIcon color="#FFF" name="photo-camera" size={scale(30)} />
  return (
    <Image
      source={cameraRetakeImg}
      resizeMode="contain"
      style={{ width: scale(86) }}
    />
  );
};

type CameraReceiptProps = INavigation<{
  amount: string;
  deal: PlaceDeal;
}>;
const emptyObj = {};
const CameraReceipt: React.FC<CameraReceiptProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isInRetakeMode, setIsInRetakeMode] = useState(false);
  const [currentPicture, setCurrentPicture] = useState<CameraTakePicture>(
    emptyObj as CameraTakePicture,
  );
  const amount = parseFloat(navigation.getParam('amount') ?? 0);
  const deal = navigation.getParam('deal');
  const cameraRef = useRef<RNCamera>(null);

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const postData = {
        user: getUserSessionSel().user.id,
        image: currentPicture,
        deal: deal.id,
        total_amount: amount,
        discount_amount: (deal.discount_percentage / 100) * amount,
      };
      const res = await checksPOST({
        data: (postData as unknown) as CheckPostData,
      });

      console.log('checksPOST resres', res);

      if (res?.deal) {
        navigation.navigate('DealClaimConfirmation', {
          postData,
          response: res,
        });
      }
    } catch (e) {
      console.log('checksPOST e', e);
      const errObj = getCaughtAxiosErrorObj(e);
      const msg =
        errObj?.error ?? errObj?.message ?? errObj?.detail ?? ERROR_500_MSG;
      Alert.alert(msg);
    }

    setLoading(false);
  };

  const takePicture = async (camera: RNCamera): Promise<void> => {
    try {
      if (loading) return;
      setLoading(true);
      const options = { quality: 0.7 };
      if (isInRetakeMode) {
        setCurrentPicture(emptyObj as CameraTakePicture);
        setIsInRetakeMode(false);
        setLoading(false);
        cameraRef?.current?.resumePreview?.();
        return;
      }

      if (Platform.OS === 'ios') {
        cameraRef?.current?.pausePreview?.();
      }

      const data: CameraTakePicture = await camera.takePictureAsync(options);

      if (Platform.OS === 'android') {
        cameraRef?.current?.pausePreview?.();
      }

      setIsInRetakeMode(true);
      setCurrentPicture(data);
      // console.log('gots!', data);
      // await setValue(data);
      // await onSubmit(data);

      // navigation.goBack('PlaceComponent');
    } catch (e) {
      console.log('camera.takepictureasync e', e);
      const errObj = getCaughtAxiosErrorObj(e);
      const msg =
        errObj?.error ?? errObj?.message ?? errObj?.detail ?? ERROR_500_MSG;
      Alert.alert(msg);
    }

    setLoading(false);
  };

  useEffect((): void => {
    return;
  }, []);

  const btnSize = scale(72);
  const absoluteButtonLeft = (WIDTH_WINDOW - btnSize) / 2;

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        playSoundOnCapture={true}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
        /*
  androidCameraPermissionOptions={{
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  }}
  androidRecordAudioPermissionOptions={{
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  }}
  */
      >
        {({ camera, status }): JSX.Element => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                height: scale(100),
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: primaryPalette.light,
                }}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingLeft: scale(20),
                  }}>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      color: primaryPalette.dark,
                      fontFamily: 'Avenir',
                      fontWeight: '300',
                      fontSize: scale(18),
                      lineHeight: scale(24),
                    }}>
                    Total Amount
                  </Text>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      color: primaryPalette.orange,
                      fontFamily: 'Avenir',
                      fontWeight: '700',
                      fontSize: scale(22),
                      lineHeight: scale(28),
                    }}>
                    ${Number(amount ?? 0)?.toLocaleString?.() ?? '0,00'}
                  </Text>
                </View>
                <ButtonShadowed
                  contentFC={
                    isInRetakeMode ? RenderCameraRetakeIcon : RenderCameraIcon
                  }
                  spinning={loading}
                  onPress={(): void => {
                    takePicture(camera);
                  }}
                  shadowed={false}
                  size={btnSize}
                  activeOpacity={0.95}
                  // eslint-disable-next-line react-native/no-inline-styles
                  btnStyle={{
                    marginTop: 0,
                    top: -(btnSize / 2),
                    left: absoluteButtonLeft,
                    backgroundColor: 'transparent',
                    // marginRight: scale(20),
                    position: 'absolute',
                  }}
                />
                {/* <ButtonShadowed onPress={() => takePicture(camera)} style={styles.capture} /> */}

                <ButtonShadowed
                  spinning={loading}
                  disabled={Object.keys(currentPicture as object)?.length === 0}
                  onPress={(): void => {
                    onSubmit();
                  }}
                  // shadowed={false}
                  // size={btnSize}
                  // eslint-disable-next-line react-native/no-inline-styles
                  btnStyle={{
                    alignSelf: 'center',
                    marginTop: 0,
                    marginRight: scale(20),
                    display:
                      Object.keys(currentPicture as object)?.length === 0
                        ? 'none'
                        : 'flex',
                  }}
                />
              </View>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

CameraReceipt.navigationOptions = (): NavigationStackOptions => ({
  header: null,
});

export default CameraReceipt;
