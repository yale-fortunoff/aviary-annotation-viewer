/* eslint-disable jsx-a11y/media-has-caption */
import React, { useContext, useEffect, useRef } from 'react';
import AnnotationViewerContext from 'context';
import getAnnotationIndexFromTime, {
  getAnnotationIndexFromAnnotation,
} from 'utils/getAnnotationIndex';
import {
  getStartAndEndFromVTTItem,
  getVideoPartVTTs,
  getVTTCueFromIVTTItem,
} from '../../utils';
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
  // setPlayerPosition: (seconds: number) => void;
  // playerPosition: number;

  videoPart: IVideoPart;
}

function Video({ videoPart, sources }: VideoProps) {
  const videoElement = useRef<HTMLVideoElement>(null);
  // const [currentText, setCurrentText] = useState<string>("");
  // const [playerPosition, setPlayerPosition] = useState<number>(0);

  // reload video element when a different part is selected
  useEffect(() => {
    videoElement.current?.load();
  }, [videoElement, videoPart]);

  const { annotationSet, annotation, setAnnotation } = useContext(
    AnnotationViewerContext
  );

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
    if (!annotationSet || !annotation) return;

    const { start: newPlayerPosition } = getStartAndEndFromVTTItem(annotation);

    // don't jump the position unless we are no longer within the right footnote
    const annotationIndex = getAnnotationIndexFromAnnotation(
      annotationSet,
      annotation
    );

    const timeBasedAnnotationIndex = getAnnotationIndexFromTime(
      annotationSet,
      videoElement?.current?.currentTime || 0
    );

    if (timeBasedAnnotationIndex !== annotationIndex) {
      jumpToPosition(newPlayerPosition);
    }

    // setPlayerPosition(newPlayerPosition);
  }, [annotation, annotationSet]);

  // useEffect(() => {
  //   if (!videoElement || !videoElement.current || !playerPosition) return;
  //   console.log('Setting player position of video element', playerPosition);
  //   videoElement.current.currentTime = playerPosition;
  // }, [videoElement, playerPosition]);

  const jumpToPosition = (seconds: number) => {
    if (!videoElement || !videoElement.current) return;
    videoElement.current.currentTime = seconds;
  };

  return (
    <div className={styles.VideoContainer}>
      <video
        controlsList="nofullscreen"
        disablePictureInPicture
        ref={videoElement}
        onTimeUpdate={(evt) => {
          evt.preventDefault();

          const seconds = videoElement.current
            ? videoElement.current.currentTime
            : 0;

          if (!annotationSet) return;

          const annotationIndex = getAnnotationIndexFromTime(
            annotationSet,
            seconds
            // playerPosition
          );

          if (annotationIndex < 0) {
            setAnnotation(undefined);
          } else {
            const newAnnotation = annotationSet?.items[annotationIndex];
            setAnnotation(newAnnotation);
          }
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
