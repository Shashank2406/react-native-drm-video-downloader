/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DrmVideoDownloader from 'react-native-drm-video-downloader';
import { useApp } from './hooks/useApp';
import Video, { DRMType } from 'react-native-video';

export default function App() {
  const AppHook = useApp();

  React.useEffect(() => {
    DrmVideoDownloader.registerTrackingEvent();
    return () => {
      DrmVideoDownloader.unregisterTrackingEvent();
    };
  }, []);

  return (
    <View>
      <TextItem
        leftText={'Name'}
        rightText={AppHook.videoRequestModel?.title}
      />
      <TextItem leftText={'Url'} rightText={AppHook.videoRequestModel?.url} />
      <TouchableOpacity
        style={[
          {
            marginTop: 16,
            padding: 8,
            backgroundColor: 'gray',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          },
        ]}
        onPress={AppHook.controlDownloadVideo}
      >
        <Text>{AppHook.getButtonText()}</Text>
      </TouchableOpacity>

      <Text
        style={[
          {
            marginTop: 16,
            fontSize: 16,
          },
        ]}
      >
        {AppHook.getProgressText()}
      </Text>
      {/* <Video
                volume={10}
                autoPlay={true}
                isLandscape={false}
                posterResizeMode="stretch"
                style={ { width: '100%', height: '50%' }}
                drm={{
                  licenseServer: 'https://proxy.uat.widevine.com/proxy?video_id=2015_tears&provider=widevine_test',
                  // certificateUrl: CertificateUrl,
                  type: DRMType.WIDEVINE,
                  // headers: {
                  //   'x-dt-auth-token': drmToken,
                  // },
                  drmOfflineMediaId: 'https://storage.googleapis.com/wvmedia/cenc/vp9/subsample/24fps/tears/tears.mpd',
                  drmKeySetId: 'ksid1ADDC12E'
                }}
                source={{
                  uri: 'https://storage.googleapis.com/wvmedia/cenc/vp9/subsample/24fps/tears/tears.mpd'}}
              /> */}
    </View>
  );
}

export const TextItem = (props?: { leftText?: string; rightText?: string }) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          marginVertical: 8,
        },
      ]}
    >
      <Text>{`${props?.leftText}: `}</Text>
      <Text>{props?.rightText}</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
