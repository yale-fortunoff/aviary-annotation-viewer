import React, { useEffect, useRef, useState } from 'react';
import { getStartAndEndFromVTTItem } from '../../api';
import {
  IAnnotationPage,
  // IVideoPart,
  IVTT,
  IVTTItem,
} from '../../api/iiifManifest';
import styles from './Captions.module.css';

interface CaptionsProps {
  // path: string;
  playerPosition: number;
  synchronize: boolean;
  // videoPart: IVideoPart;

  annotationSet?: IAnnotationPage;

  // TODO - Use these for the synch button implementation
  // eslint-disable-next-line react/no-unused-prop-types
  enableSynch: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  disableSynch: () => void;
  toggleSynch: () => void;
}

Captions.defaultProps = {
  annotationSet: undefined,
};

// interface Caption {
//   text: string;
//   start: string;
//   end: string;
// }

// interface Footnote extends Caption {
//   label: string;
// }

// function Loading() {
//   return <div>LoAdInG...</div>;
// }

function getFootnoteFromTime(seconds: number, captions: IVTT) {
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
  // const [captionsData, setCaptionsData] = useState<Array<Footnote>>([]);
  const [activeFootnoteIndex, setActiveFootnoteIndex] = useState<number>(0);
  const footnoteContainerRef = useRef<HTMLOListElement>(null);
  const { playerPosition, synchronize, annotationSet, toggleSynch } = props;
  // const captions = getVideoPartFootnotes(videoPart);

  useEffect(() => {
    if (!annotationSet) {
      return;
    }
    const newFootnoteIndex = getFootnoteFromTime(playerPosition, annotationSet);
    setActiveFootnoteIndex(newFootnoteIndex);
  }, [playerPosition, activeFootnoteIndex, annotationSet]);

  useEffect(() => {
    if (synchronize && footnoteContainerRef.current) {
      const { children } = footnoteContainerRef.current;
      const child = children[activeFootnoteIndex];
      child.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [playerPosition, activeFootnoteIndex, synchronize]);

  if (!annotationSet) {
    return <div>Something went wrong while loading captions data.</div>;
  }

  return (
    <div className={styles.CaptionsContainer}>
      {/* <div className={styles.CaptionMeta}>
        {activeFootnoteIndex + 1} of {captionsData.length}
      </div> */}
      <div className={styles.SynchButtonContainer}>
        <button
          type="button"
          className={styles.SynchButton}
          onClick={() => {
            toggleSynch();
          }}
        >
          {synchronize ? 'unsynch' : 'synch'}
        </button>
      </div>
      <ol className={styles.CaptionColumn} ref={footnoteContainerRef}>
        {annotationSet.items.map((caption: IVTTItem, idx) => {
          const isActiveFootnote = activeFootnoteIndex === idx;

          return (
            <li
              key={caption.id}
              className={`${styles.Caption} ${
                isActiveFootnote
                  ? styles.ActiveFootnote
                  : styles.InactiveFootnote
              }`}
            >
              <div className={styles.CaptionLabel}>{idx + 1}</div>
              <div
                className={styles.CaptionText}
                // It has to be done this way.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: caption.body.value }}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Captions;
