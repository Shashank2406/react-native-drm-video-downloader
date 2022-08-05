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
      // id: 'b4d51cd8-adb3-4eed-bd18-e417944a5d3c',
      licenseUrl:
        'https://lic.drmtoday.com/license-proxy-widevine/cenc/?specConform=true',
      url:
        'https://g33ojbkyqtvod.vcdn.cloud/storage02/hbo/12th_delaware_fixedbyqnetv1/dash/master.mpd',
      scheme: 'widevine',
      drmLicenseRequestHeaders: {
        'x-dt-auth-token':
          'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjo4ZTk4ZmExZC1kZWU4LTQ5NTEtYmIyNy1mMjBmZWRhNjMzYTRcIixcImFzc2V0SWRcIjpcIjAxNDkyNkEwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiOGU5OGZhMWQtZGVlOC00OTUxLWJiMjctZjIwZmVkYTYzM2E0XCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCJjZGE1M2Y3Ny0wMDYyLTRjZmUtYTIwOS04OTFiN2VmYmJlZjhcIn0iLCJpYXQiOjE2NTc5NjgxNzYsImp0aSI6ImdzMjJ3RXh5MTkxdjJLOGgzY2NKM1E9PSJ9.Us5a6Am_ZEJBTq7Dxuh2etXrHvK50-QSpltsmEY0LrXjmOX2AQVS86zGNuz2wgnywb2wGOXQCXPSTqag-CgfMw',
      },
      title: 'Demo video',
      // isProtected: false,
    });
  };

  const createModelForiOS = () => {
    setVideoRequestModel({
      id: 'e851bf95-3011-42c2-9556-33856c6ad0a6',
      licenseUrl: 'https://lic.drmtoday.com/license-server-fairplay/',
      url: 'https://g33ojbkyqtvod.vcdn.cloud/storage02/hbo/12th_delaware_fixedbyqnetv1/hls/master.m3u8',
      scheme: 'fairplay',
      drmLicenseRequestHeaders: {
        'x-dt-auth-token':
          'eyJhbGciOiJIUzUxMiJ9.eyJjcnQiOiJbe1wiYWNjb3VudGluZ0lkXCI6XCJxbjo4NTBjODUyYS0zZmQzLTQ0ODAtYjMxMC05ODY3N2MyNTVlN2VcIixcImFzc2V0SWRcIjpcIjAxNDkyNkEwXCIsXCJ2YXJpYW50SWRcIjpcInZvZFwiLFwicHJvZmlsZVwiOntcInB1cmNoYXNlXCI6e319LFwib3V0cHV0UHJvdGVjdGlvblwiOntcImRpZ2l0YWxcIjpmYWxzZSxcImFuYWxvZ3VlXCI6dHJ1ZSxcImVuZm9yY2VcIjp0cnVlfSxcInN0b3JlTGljZW5zZVwiOnRydWUsXCJyZWFsVGltZUV4cGlyYXRpb25cIjpmYWxzZX1dIiwib3B0RGF0YSI6IntcInVzZXJJZFwiOlwiODUwYzg1MmEtM2ZkMy00NDgwLWIzMTAtOTg2NzdjMjU1ZTdlXCIsXCJtZXJjaGFudFwiOlwicW5ldFwiLFwic2Vzc2lvbklkXCI6XCI4ODI2Y2FjZS0wYTk4LTQ1NjgtYTZkMy1kNTcwYTNiZTkxZjFcIn0iLCJpYXQiOjE2NTk2ODY5ODEsImp0aSI6IlBaRFVHek9RcGJKN255MHFKVlZKcnc9PSJ9.bdXwd8s_e9xi6A5duC41FjJMGX0IVbxOpXcAS-rm5JwThOzvjRLiZrF5O8uBiYd480S4Nl9D14YzdFsGFMFbzQ',
      },
      contentKeyIds: [
        'skd://drmtoday?assetId=014926A0&variantId=vod'
      ],
      title: 'Demo video',
      // isProtected: true,
    });
  };

  useEffect(() => {
    if (videoRequestModel) {
      getVideoStatus();
    }
  }, [videoRequestModel]);

  useEffect(() => {
    if (videoInfo) {
      console.log(videoInfo);
    }
  }, [videoInfo]);

  useEffect(() => {
    var eventEmitter = new NativeEventEmitter(NativeModules.DrmVideoDownloader);
    var eventListenerSub = eventEmitter.addListener(
      DRMVideoEventName,
      (info?: DRMVideoInfo) => {
        // console.log('info', info);
        setVideoInfo(info);
      }
    );
    return () => {
      // return eventListenerSub.remove();
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
    console.log(videoInfo)
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
