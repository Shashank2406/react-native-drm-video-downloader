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
                    'x-dt-auth-token': 'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjo4NTBjODUyYS0zZmQzLTQ0ODAtYjMxMC05ODY3N2MyNTVlN2VcIixcImFzc2V0SWRcIjpcIjAxNDkyNkEwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiODUwYzg1MmEtM2ZkMy00NDgwLWIzMTAtOTg2NzdjMjU1ZTdlXCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCIxODU3NWIxOC05ZmQxLTRiMTItYWI2ZS1lYTYxMzRiZWM1YTVcIn0iLCJpYXQiOjE2NTk4MTQ4MTQsImp0aSI6ImIzUSs4RDBvcFVUWmkyS0xVQlNGdmc9PSJ9.45LjkGkWN-zOka5wZ9WFmheQFARaFx1_23nrAtKTnPeQ_oTuck4JZ-jmta7DbcGw4PZBxIWc9yOzFM7j6YAoiQ',
                  },
                  drmOfflineMediaId: 'e851bf95-3011-42c2-9556-33856c6ad0a6',
                }}
                source={{
                  uri: 'https://g33ojbkyqtvod.vcdn.cloud/storage01/hbo/the_powerpuff_girls_s3_07_bought_and_scold/hls/master.m3u8'}}
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
