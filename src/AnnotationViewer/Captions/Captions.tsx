import AnnotationViewerContext from 'context';
import React, { useContext, useEffect, useRef, useState } from 'react';
import getAnnotationIndexFromTime, {
  getAnnotationIndexFromAnnotation,
} from 'utils/getAnnotation';
import { IAnnotationItem } from '../../api/iiifManifest';
import styles from './Captions.module.css';

function Captions() {
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number>(0);
  const annotationContainerRef = useRef<HTMLOListElement>(null);

  const { annotation, playerPosition, annotationSet, sync, setAnnotation } =
    useContext(AnnotationViewerContext);

  useEffect(() => {
    if (!annotationSet) return;

    const newAnnotationIndex = getAnnotationIndexFromTime(
      playerPosition,
      annotationSet
    );
    setActiveAnnotationIndex(newAnnotationIndex);
  }, [playerPosition, annotationSet]);

  useEffect(() => {
    if (sync && annotationContainerRef.current) {
      const { children } = annotationContainerRef.current;
      const child = children[activeAnnotationIndex];
      child.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
      if (!annotationSet) return;
      setTimeout(
        () => setAnnotation(annotationSet.items[activeAnnotationIndex]),
        500
      );
    }
  }, [activeAnnotationIndex, sync]);

  useEffect(() => {
    if (!annotation || !annotationSet) {
      return;
    }
    const annotationIndex = getAnnotationIndexFromAnnotation(
      annotation,
      annotationSet
    );

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
