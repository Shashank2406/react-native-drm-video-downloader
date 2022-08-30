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

  const [videoInfo, setVideoInfo] = React.useState(false);

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
        onPress={() => {
          setVideoInfo(true)
        }}
      >
        <Text>Play Video</Text>
      </TouchableOpacity>
      {
        videoInfo && 
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
          // licenseServer: 'https://lic.drmtoday.com/license-server-fairplay/?offline=true',
          // certificateUrl: 'https://lic.drmtoday.com/license-server-fairplay/cert/qnet',
          // type: DRMType.FAIRPLAY,
          // headers: {
          //   'x-dt-auth-token': 'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjpkZGMxM2JjNi0wNmZmLTQ5MmItOTFjNi0zODFjZTVlZTRhODBcIixcImFzc2V0SWRcIjpcIjAyMTg1OFgwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiZGRjMTNiYzYtMDZmZi00OTJiLTkxYzYtMzgxY2U1ZWU0YTgwXCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCI2NGUwZmZlZi02MzBhLTQ5YTUtOTBlZC0wYmM3ZGM0OGIwM2NcIn0iLCJpYXQiOjE2NjE3NjQ0ODUsImp0aSI6ImxJcHZKT0V3SkYwaTVKbCtWdXNMXC93PT0ifQ.ZGnMDjozCgnqqYJIIfAVhCV66cv5TTRrClXI5kCo_kyuxfL1_UgR4NcYAPZPxY5WEcALeQ45XXlfe5mWI_hZVA',
          // },
          drmOfflineMediaId: 'e851bf95-3011-42c2-9556-33856c6ad0a6',
          drmKeySetId: 'e851bf95-3011-42c2-9556-33856c6ad0a6'
        }}
        source={{
          uri: 'https://vodproduct.msky.vn/storage01/hbo/the_powerpuff_girls_s3_01_fallen_arches/hls/master.m3u8'}}
      /> 
      }
      
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
