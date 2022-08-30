/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  DRMVideoRequestModel,
  DRMVideoState,
  DRMVideoInfo,
  DRMVideoEventName,
} from 'react-native-drm-video-downloader';
import DrmVideoDownloader from 'react-native-drm-video-downloader';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export const useApp = () => {
  const [videoRequestModel, setVideoRequestModel] = useState<
    DRMVideoRequestModel | undefined
  >();
  const [videoInfo, setVideoInfo] = useState<DRMVideoInfo | undefined>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      createModelForAndroid();
    } else {
      createModelForiOS();
    }
  }, []);

  const createModelForAndroid = () => {
    setVideoRequestModel({
      id: 'b4d51cd8-adb3-4eed-bd18-e417944a5d3c',
      licenseUrl:
        'https://mvvuni.keydelivery.southeastasia.media.azure.net/FairPlay/?kid=7360f352-d459-475e-9351-970970b378e4',
      url:
        'https://mvvuni-aase.streaming.media.azure.net/f12053ab-1009-43dd-8e6e-44b1ba5000ed/Big_Buck_Bunny_30s.ism/manifest(format=mpd-time-csf,encryption=cenc)',
      scheme: 'widevine',
      drmLicenseRequestHeaders: {
        Authorization:
          'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjpkZGMxM2JjNi0wNmZmLTQ5MmItOTFjNi0zODFjZTVlZTRhODBcIixcImFzc2V0SWRcIjpcIjAyMTg1OFgwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiZGRjMTNiYzYtMDZmZi00OTJiLTkxYzYtMzgxY2U1ZWU0YTgwXCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCIxMGQ1M2QyOC0yOTQxLTQ2MmItOGE3OC1lZWFjNTU0YTIxODhcIn0iLCJpYXQiOjE2NjE3NzY4NDMsImp0aSI6Im5PZDJZcVJhMWNHT05wU3pUU2taYWc9PSJ9.RbfGWkMzzGdhGKwM_tWbEmjLViwLuRN7Szq-eUBjDjYOMLqLQTbvBRXTCpL3L8hRo4qXTlAd6N3jSjCf_OYD-w',
      },
      title: 'Demo video',
      isProtected: true,
    });
  };

  const createModelForiOS = () => {
    setVideoRequestModel({
      id: 'e851bf95-3011-42c2-9556-33856c6ad0a6',
      licenseUrl: 'https://lic.drmtoday.com/license-server-fairplay/?offline=true',
      url: 'https://vodproduct.msky.vn/storage01/hbo/the_powerpuff_girls_s3_01_fallen_arches/hls/master.m3u8',
      
      scheme: 'fairplay',
      drmLicenseRequestHeaders: {
        'x-dt-auth-token':
          'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjpkZGMxM2JjNi0wNmZmLTQ5MmItOTFjNi0zODFjZTVlZTRhODBcIixcImFzc2V0SWRcIjpcIjAyMTg1OFgwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiZGRjMTNiYzYtMDZmZi00OTJiLTkxYzYtMzgxY2U1ZWU0YTgwXCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCIxYjA3YTU3MC03NTk4LTRmZTAtYTZkNi01NjViYWMwMDFjMzhcIn0iLCJpYXQiOjE2NjE4NjIxMjYsImp0aSI6Im5aTVl4VnRBWTlFdkRnMEg0YnpOQ3c9PSJ9.R5tSeHoUmCrZLo0GixBhyGYOx3ZoyY2ly34XGrs7BEKynt2sotA_dCFOIxu6SJUCh29ytXqLubZiWyXqwJqw4w',
      },
      contentKeyIds: [
        'skd://drmtoday?assetId=021858X0&variantId=vod'
      ],
      title: 'Demo video',
       isProtected: true,
    });
  };

  useEffect(() => {
    if (videoRequestModel) {
      getVideoStatus();
    }
  }, [videoRequestModel]);

  useEffect(() => {
    var eventEmitter = new NativeEventEmitter(NativeModules.DrmVideoDownloader);
    var eventListenerSub = eventEmitter.addListener(
      DRMVideoEventName,
      (info?: DRMVideoInfo) => {
        console.log('info', info);
        setVideoInfo(info);
      }
    );
    return () => {
      return eventListenerSub.remove();
    };
  }, []);

  const getVideoStatus = () => {
    DrmVideoDownloader.getDownloadableInfo(videoRequestModel).then(
      (videoInfo) => {
        setVideoInfo(videoInfo);
      }
    );
  };

  const download = () => {
    console.log('start download video');
    DrmVideoDownloader.download(videoRequestModel).finally(() => {
      getVideoStatus();
    });
  };

  const removeVideo = () => {
    console.log('remove download video');
    DrmVideoDownloader.removeDownload(videoRequestModel).finally(() => {
      getVideoStatus();
    });
  };

  const resume = () => {
    console.log('resume download video');
    DrmVideoDownloader.resumeAllDownload().finally(() => {
      getVideoStatus();
    });
  };

  const pause = () => {
    console.log('resume download video');
    DrmVideoDownloader.pauseAllDownload().finally(() => {
      getVideoStatus();
    });
  };

  const controlDownloadVideo = () => {
    if (videoInfo) {
      switch (videoInfo.state) {
        case DRMVideoState.NOT_STARTED:
          download();
          break;
        case DRMVideoState.STATE_COMPLETED:
          removeVideo();
          break;
        case DRMVideoState.STATE_DOWNLOADING:
          pause();
          break;
        case DRMVideoState.STATE_QUEUED:
          resume();
          break;
        default:
          console.log('not active action for request downlaod video');
          break;
      }
    } else {
      download();
    }
  };

  const getButtonText = () => {
    switch (videoInfo?.state) {
      case DRMVideoState.NOT_STARTED:
        return 'Click to start download video';
      case DRMVideoState.STATE_COMPLETED:
        return 'Video has been downloaded complete.  Click here to delete download';
      case DRMVideoState.STATE_DOWNLOADING:
        return 'Video is downloading. Click here to pause download';
      case DRMVideoState.STATE_FAILED:
        return 'Download video is failed.Click to start download video';
      case DRMVideoState.STATE_RESTARTING:
        return 'Download video is failed.Click to start download video';
      case DRMVideoState.STATE_QUEUED:
        return 'Download video was pause. Click here to continue';
      default:
        return 'Click to start download video';
    }
  };

  const getProgressText = () => {
    if (videoInfo) {
      switch (videoInfo.state) {
        case DRMVideoState.STATE_DOWNLOADING:
          return `Download progress : ${videoInfo.progress ?? 0}`;
      }
    }
    return undefined;
  };

  return {
    videoRequestModel,
    setVideoRequestModel,
    getVideoStatus,
    videoInfo,
    controlDownloadVideo,
    getButtonText,
    getProgressText,
  };
};
