/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DrmVideoDownloader from 'react-native-drm-video-downloader';
import { useApp } from './hooks/useApp';
import Video, { DRMType } from 'react-native-video-offline-playback';

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
       <Video
                volume={10}
                autoPlay={false}
                isLandscape={true}
                posterResizeMode="stretch"
                style={ { width: '100%', height: '50%' }}
                onError={(err) => {
                  console.log('VideoPlayer Error', err);
                }}
                drm={{
                  licenseServer: 'https://lic.drmtoday.com/license-server-fairplay/',
                  certificateUrl: 'https://lic.drmtoday.com/license-server-fairplay/cert/qnet',
                  type: DRMType.FAIRPLAY,
                  headers: {
                    'x-dt-auth-token': 'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjo4ZTk4ZmExZC1kZWU4LTQ5NTEtYmIyNy1mMjBmZWRhNjMzYTRcIixcImFzc2V0SWRcIjpcIjAxNDkyNkEwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiOGU5OGZhMWQtZGVlOC00OTUxLWJiMjctZjIwZmVkYTYzM2E0XCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCJkZDQ2ZGQ2My1mZjEwLTQ2NTQtODRjMi0wZjcxYjA3NWU0NzRcIn0iLCJpYXQiOjE2NTgzMDI2MjUsImp0aSI6IkFKeVpWVzRCUFRsR3BsMGZJUThlWXc9PSJ9.BNdbgNuTgFgrM5L-nKDt2pjoAs5nGBUs9nW8emUYA5ZjBBoEdeGbFkHW_kYhgVG8JDj_JCyCIFT66adtYQaf7A',
                  },
                  drmOfflineMediaId: 'e851bf95-3011-42c2-9556-33856c6ad0a6',
                  drmKeySetId: 'e851bf95-3011-42c2-9556-33856c6ad0a6'
                }}
                source={{
                  uri: 'https://g33ojbkyqtvod.vcdn.cloud/storage02/hbo/12th_delaware_fixedbyqnetv1/hls/master.m3u8'}}
              /> 
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
