/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import { getVideoPartVTTs, getVTTCueFromIVTTItem } from '../../api';
import {
  IVideoPart,
  IAnnotationItem,
  IAnnotationPage,
} from '../../api/iiifManifest';
import styles from './Video.module.css';

// interface Track {
//   label?: string;
//   languageCode: string;
//   src: string;
// }

interface VideoSource {
  src: string;
  type: string;
}

interface VideoProps {
  // tracks: Array<Track>;
  sources: Array<VideoSource>;
  setPlayerPosition: (seconds: number) => void;
  playerPosition: number;

  videoPart: IVideoPart;
}

function Video(props: VideoProps) {
  const videoElement = useRef<HTMLVideoElement>(null);
  // const [currentText, setCurrentText] = useState<string>("");

  const { videoPart, sources } = props;

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
    const tracks = videoElement.current?.textTracks || [];
    for (let i = 0; i < tracks.length; i += 1) {
      // const track: TextTrack = tracks[i];
      // track.oncuechange = handleCueChange;
    }
  }, [videoElement]);

  return (
    <>
      <div className={styles.VideoContainer}>
        <video
          ref={videoElement}
          onTimeUpdate={() => {
            const seconds = Math.round(
              videoElement.current ? videoElement.current.currentTime : 0
            );
            if (seconds === props.playerPosition) {
              return;
            }
            // console.log(`${seconds} seconds`);
            props.setPlayerPosition(seconds);
          }}
          className={styles.Video}
          controls
        >
          {sources.map((source: VideoSource) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          {/* {props.tracks.map((track: Track) => (
            <track
              ref={trackElement}
              label={track.label || track.languageCode}
              kind="subtitles"
              srcLang={track.languageCode}
              src={track.src}
              default
            />
          ))} */}
        </video>
        {/* <div className={styles.CaptionContainer}>{currentText}</div> */}
      </div>
    </>
  );
}

export default Video;
