import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import AnnotationViewerContext from 'context';
import deserializeURL, {
  stateToURL,
  URLState,
  validateState,
} from 'utils/deserializeURL';
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
    if (!manifest || !videoPart || !annotationSet || !annotation) return;

    validateState(
      {
        videoPart,
        annotationSet,
        annotation,
      },
      manifest
    ).then((cleanState) => {
      stateToURL(cleanState).then((components) => {
        if (!manifest) return;
        if (cleanState.videoPart !== videoPart) {
          console.log('fixing video part');
          setVideoPart(cleanState.videoPart);
        }
        if (cleanState.annotationSet !== annotationSet) {
          console.log('fixing annotation set');
          setAnnotationSet(cleanState.annotationSet);
        }
        if (cleanState.annotation !== annotation) {
          console.log('fixing annotation', cleanState.annotation?.body);
          setAnnotation(cleanState.annotation);
        }

        console.log('Not doing anything with components', components);
        // updateURL(history, components, manifest);
      });
    });
  }, [videoPart, annotationSet, annotation]);

  useEffect(() => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData: IManifest) => {
        setManifest(manifestData);
        deserializeURL(history.location.search.toString(), manifestData).then(
          (urlState: URLState) => {
            setVideoPart(urlState.videoPart);
            setAnnotationSet(urlState.annotationSet);
            setAnnotation(urlState.annotation);

            if (urlState.annotation)
              console.log('initial annotation', urlState.annotation?.body);
          }
        );
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
