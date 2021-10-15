import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import insecureStringHash from 'utils/hash';
import AnnotationViewerContext from 'context';
import updateURL from 'utils/updateURL';
import deserializeURL, { URLState } from 'utils/deserializeURL';
import { PlayerSize } from './Player/Player';
import { IControlBarLinkItem } from './ControlBar/ControlBar';
import {
  IAnnotationItem,
  IAnnotationPage,
  IManifest,
  IVideoPart,
} from '../api/iiifManifest';
import AnnotationViewerDisplayComponent from './AnnotationViewerDisplayComponent';

export interface AnnotationViewerProps {
  manifestURL: string;
  callNumber: string;
  playerSize?: PlayerSize;
  controlBarLinks: Array<IControlBarLinkItem>;
}

AnnotationViewer.defaultProps = {
  playerSize: 'medium',
};

function AnnotationViewer(props: AnnotationViewerProps) {
  const { seconds: initialSeconds } = useParams<{ seconds: string }>();
  const [playerPosition, setPlayerPosition] = useState<number>(
    Number(initialSeconds) || 0
  );
  const [syncAnnotationsToPlayer, setSyncAnnotationsToPlayer] =
    useState<boolean>(true);
  const [manifest, setManifest] = useState<IManifest>();
  const [videoPart, setVideoPart] = useState<IVideoPart>();
  const [annotation, setAnnotation] = useState<IAnnotationItem>();
  const [annotationSet, setAnnotationSet] = useState<IAnnotationPage>();
  const history = useHistory();

  const { manifestURL, callNumber, controlBarLinks } = props;

  const toggleSync = () => {
    setSyncAnnotationsToPlayer(!syncAnnotationsToPlayer);
  };

  useEffect(() => {
    Promise.all([
      insecureStringHash(videoPart?.id || ''),
      insecureStringHash(annotationSet?.id || ''),
      insecureStringHash(annotation?.id || ''),
    ]).then((arr) => {
      const [part, set, anno] = arr.map((item) => item.slice(0, 8));

      // TODO - This is a bit hacky.
      // 'e3b0c442' is the result of hashing the empty string
      const EMPTY_STRING_HASH = 'e3b0c442';
      const dropIfEmpty = (x: string) =>
        x !== EMPTY_STRING_HASH ? x : undefined;
      updateURL(history, {
        part: dropIfEmpty(part),
        set: dropIfEmpty(set),
        anno: dropIfEmpty(anno),
      });
    });
  }, [videoPart, annotationSet, annotation]);

  useEffect(() => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData: IManifest) => {
        setManifest(manifestData);
        deserializeURL(history, manifestData).then((urlState: URLState) => {
          setVideoPart(urlState.videoPart);
          setAnnotationSet(urlState.annotationSet);
          setAnnotation(urlState.annotation);
        });
      });
  }, [manifestURL]);

  return (
    <AnnotationViewerContext.Provider
      value={{
        playerSize: 'medium',
        manifest,
        videoPart,
        annotationSet,
        playerPosition,
        annotation,
        sync: syncAnnotationsToPlayer,
        setAnnotation,
        setAnnotationSet,
        setPlayerPosition,
        setVideoPart,
        toggleSync,
      }}
    >
      <AnnotationViewerDisplayComponent
        callNumber={callNumber}
        controlBarLinks={controlBarLinks}
      />
    </AnnotationViewerContext.Provider>
  );
}

export default AnnotationViewer;
