/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import { getVideoPartVTTs, getVTTCueFromIVTTItem } from '../../utils';
import {
  IVideoPart,
  IAnnotationItem,
  IAnnotationPage,
} from '../../api/iiifManifest';
import styles from './Video.module.css';

interface VideoSource {
  src: string;
  type: string;
}

interface VideoProps {
  sources: Array<VideoSource>;
  setPlayerPosition: (seconds: number) => void;
  playerPosition: number;

  videoPart: IVideoPart;
}

function Video({
  videoPart,
  sources,
  playerPosition,
  setPlayerPosition,
}: VideoProps) {
  const videoElement = useRef<HTMLVideoElement>(null);
  // const [currentText, setCurrentText] = useState<string>("");

  useEffect(() => {
    videoElement.current?.load();
  }, [videoElement, videoPart]);

  useEffect(() => {
    if (!videoElement) {
      return;
    }

    const VTTs = getVideoPartVTTs(videoPart);

    (async () => {
      VTTs.forEach((VTT: IAnnotationPage) => {
        const label: string = VTT.label.en[0].replace('.vtt', '');
        const parts = label.split('_').reverse();
        let lang = 'en';
        if (parts[0].length === 2) {
          [lang] = parts;
        }

        const track = videoElement.current?.addTextTrack(
          'captions',
          label,
          lang
        );

        VTT.items.forEach((cue: IAnnotationItem) => {
          // const { start, end } = getStartAndEndFromVTTItem(cue);
          track?.addCue(getVTTCueFromIVTTItem(cue));
        });
      });
    })();
  }, [videoElement, videoPart]);

  useEffect(() => {
    if (!videoElement || !videoElement.current || !playerPosition) return;

    videoElement.current.currentTime = playerPosition;
  }, [videoElement, playerPosition]);

  return (
    <div className={styles.VideoContainer}>
      <video
        controlsList="nofullscreen"
        disablePictureInPicture
        ref={videoElement}
        onTimeUpdate={() => {
          const seconds = Math.round(
            videoElement.current ? videoElement.current.currentTime : 0
          );
          setPlayerPosition(seconds);
        }}
        className={styles.Video}
        controls
      >
        {sources.map((source: VideoSource) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
}

export default Video;
