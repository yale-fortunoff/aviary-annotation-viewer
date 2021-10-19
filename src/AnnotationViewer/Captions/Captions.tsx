import AnnotationViewerContext from 'context';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getStartAndEndFromVTTItem } from 'utils';
import { getAnnotationIndexFromAnnotation } from 'utils/getAnnotationIndex';
import { IAnnotationItem } from '../../api/iiifManifest';
import styles from './Captions.module.css';

function Captions() {
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number>(0);
  const annotationContainerRef = useRef<HTMLOListElement>(null);

  const { annotation, setAnnotation, annotationSet, sync } = useContext(
    AnnotationViewerContext
  );

  useEffect(() => {
    if (sync && annotationContainerRef.current) {
      const { children } = annotationContainerRef.current;

      const child = children[activeAnnotationIndex];
      child?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [activeAnnotationIndex, sync]);

  useEffect(() => {
    if (!annotation || !annotationSet) {
      setActiveAnnotationIndex(0);
      return;
    }

    const annotationIndex = getAnnotationIndexFromAnnotation(
      annotationSet,
      annotation
    );

    if (annotationIndex < 0) {
      setActiveAnnotationIndex(0);
      return;
    }

    setActiveAnnotationIndex(annotationIndex);
  }, [annotation]);

  if (!annotationSet) {
    return <div>Loading annotation set</div>;
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

          // https:// stackoverflow.com/a/25279399
          const timeString = (seconds: number) => {
            const date = new Date(0);
            date.setSeconds(seconds);
            return date.toISOString().substr(11, 8);
          };

          const { start, end } = getStartAndEndFromVTTItem(caption);

          return (
            <li
              data-start={start}
              data-end={end}
              key={caption.id}
              className={`${styles.Caption} ${
                isActiveAnnotation
                  ? styles.ActiveAnnotation
                  : styles.InactiveAnnotation
              }`}
            >
              <div className={styles.CaptionLabel}>{idx + 1}</div>
              <div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setAnnotation(caption);
                    }}
                  >
                    {timeString(start)} - {timeString(end)}
                  </button>
                </div>
                <div
                  className={styles.CaptionText}
                  // It has to be done this way.
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: captionContent }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Captions;
