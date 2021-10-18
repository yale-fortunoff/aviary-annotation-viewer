import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import AnnotationViewerContext from 'context';
import {
  searchStringToURLComponents,
  stateToURLComponents,
  URLComponentsToValidState,
  AppState,
  validateState,
} from 'utils/appState';
import updateURL from 'utils/updateURL';
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
  const [appState, _setAppState] = useState<AppState>({});

  const { videoPart, annotationSet, annotation } = appState;

  const history = useHistory();

  const setAppState = ({
    videoPart: newVideoPart,
    annotationSet: newAnnotationSet,
    annotation: newAnnotation,
  }: AppState) => {
    if (!manifest) return;

    _setAppState(
      validateState(
        {
          videoPart: newVideoPart || videoPart,
          annotationSet: newAnnotationSet || annotationSet,
          annotation: newAnnotation || annotation,
        },
        manifest
      )
    );
  };

  const setAnnotation = (newAnnotation: IAnnotationItem) =>
    setAppState({ annotation: newAnnotation });
  const setAnnotationSet = (newAnnotationSet: IAnnotationPage) =>
    setAppState({ annotationSet: newAnnotationSet });
  const setVideoPart = (newVideoPart: IVideoPart) =>
    setAppState({ videoPart: newVideoPart });

  const { manifestURL, callNumber, controlBarLinks } = props;

  const toggleSync = () => {
    setSyncAnnotationsToPlayer(!syncAnnotationsToPlayer);
  };

  // set the initial state when the manifest loads
  useEffect(() => {
    if (!manifest) return;

    const searchString = history.location.search.toString();
    const components = searchStringToURLComponents(searchString);

    URLComponentsToValidState(components, manifest).then((initialState) => {
      setAppState(initialState);
    });
  }, [manifest]);

  // when the manifest URL is available, fetch it
  useEffect(() => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData: IManifest) => {
        setManifest(manifestData);
      });
  }, [manifestURL]);

  // when the app state is updated, update the URL to match
  useEffect(() => {
    if (!manifest) return;
    if (!videoPart || !annotationSet || !annotation) return;
    stateToURLComponents(appState).then((components) =>
      updateURL(history, components, manifest)
    );
  }, [appState]);

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
