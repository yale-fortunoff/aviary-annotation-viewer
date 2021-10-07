import React, { useEffect, useRef, useState } from 'react';
import { getStartAndEndFromVTTItem } from '../../api';
import {
  IAnnotationPage,
  // IVideoPart,
  IAnnotationItem,
} from '../../api/iiifManifest';
import styles from './Captions.module.css';

interface CaptionsProps {
  // path: string;
  playerPosition: number;
  synchronize: boolean;
  // videoPart: IVideoPart;

  annotationSet?: IAnnotationPage;
}

Captions.defaultProps = {
  annotationSet: undefined,
};

function getAnnotationFromTime(seconds: number, captions: IAnnotationPage) {
  let ret = 0;
  for (let i = 0; i < captions.items.length; i += 1) {
    const captionItem = captions.items[i];
    const { start } = getStartAndEndFromVTTItem(captionItem);

    if (start >= seconds) {
      ret = i;
      break;
    }
  }
  return ret;
}

function Captions(props: CaptionsProps) {
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number>(0);
  const annotationContainerRef = useRef<HTMLOListElement>(null);
  const { playerPosition, synchronize, annotationSet } = props;

  useEffect(() => {
    if (!annotationSet) {
      return;
    }
    const newAnnotationIndex = getAnnotationFromTime(
      playerPosition,
      annotationSet
    );
    setActiveAnnotationIndex(newAnnotationIndex);
  }, [playerPosition, activeAnnotationIndex, annotationSet]);

  useEffect(() => {
    if (synchronize && annotationContainerRef.current) {
      const { children } = annotationContainerRef.current;
      const child = children[activeAnnotationIndex];
      child.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [playerPosition, activeAnnotationIndex, synchronize]);

  if (!annotationSet) {
    return <div>Something went wrong while loading captions data.</div>;
  }

  return (
    <div className={styles.CaptionsContainer}>
      <ol className={styles.CaptionColumn} ref={annotationContainerRef}>
        {annotationSet.items.map((caption: IAnnotationItem, idx) => {
          const isActiveAnnotation = activeAnnotationIndex === idx;

          // TODO - Support XML (annotations with array bodies) if required
          let captionContent = '';
          if ('value' in caption.body) {
            captionContent = caption.body.value;
          } else {
            captionContent = `XML annotations not supported. Array of length ${caption.body.length}`;
          }

          return (
            <li
              key={caption.id}
              className={`${styles.Caption} ${
                isActiveAnnotation
                  ? styles.ActiveAnnotation
                  : styles.InactiveAnnotation
              }`}
            >
              <div className={styles.CaptionLabel}>{idx + 1}</div>
              <div
                className={styles.CaptionText}
                // It has to be done this way.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: captionContent }}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Captions;
