import React, { useEffect, useRef } from 'react';
import { getVideoPartVTTs, getVTTCueFromIVTTItem } from '../../api';
import { IVideoPart, IVTT, IVTTItem } from '../../api/iiifManifest';
import styles from './Video.module.css';

interface Track {
  label?: string;
  languageCode: string;
  src: string;
}

interface VideoSource {
  src: string;
  type: string;
}

interface VideoProps {
  tracks: Array<Track>;
  sources: Array<VideoSource>;
  setPlayerPosition: (seconds: number) => void;
  playerPosition: number;

  videoPart: IVideoPart;
}

function Video(props: VideoProps) {
  const videoElement = useRef<HTMLVideoElement>(null);
  // const [currentText, setCurrentText] = useState<string>("");

  const { videoPart } = props;

  useEffect(() => {
    console.log('Updating video part');
    videoElement.current?.load();
  }, [videoElement, videoPart]);

  useEffect(() => {
    if (!videoElement) {
      return;
    }

    const VTTs = getVideoPartVTTs(videoPart);

    (async function () {
      VTTs.forEach((VTT: IVTT) => {
        const track = videoElement.current?.addTextTrack(
          'captions',
          'Captions',
          'en'
        );

        console.log('Adding VTT track', VTT, track);

        VTT.items.forEach((cue: IVTTItem) => {
          // const { start, end } = getStartAndEndFromVTTItem(cue);
          track?.addCue(getVTTCueFromIVTTItem(cue));
        });
      });
    })();
  }, [videoElement, videoPart]);

  // const handleCueChange = (evt) => {
  //   if (!track.activeCues) {
  //     return;
  //   }
  //   let text = "";
  //   const cueCount = track.activeCues.length;
  //   for (let i = 0; i < cueCount || 0; i++) {
  //     const cue: TextTrackCue = track.activeCues[i];
  //     const cueText = (cue as VTTCue).text;
  //     console.log("track cue text", cueText);
  //     text += ` ${cueText || ""}`;
  //   }
  //   // setCurrentText(text);
  // };
  useEffect(() => {
    console.log('video text tracks', videoElement.current?.textTracks);
    const tracks = videoElement.current?.textTracks || [];
    for (let i = 0; i < tracks.length; i++) {
      // const track: TextTrack = tracks[i];

      console.log('Track', tracks[i]);
      // track.oncuechange = handleCueChange;
    }
  }, [videoElement]);

  return (
    <React.Fragment>
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
          {props.sources.map((source: VideoSource) => (
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
    </React.Fragment>
  );
}

export default Video;
