import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AnnotationViewerContext from 'context';
import {
  searchStringToURLComponents,
  stateToURLComponents,
  URLComponentsToValidState,
  AppState,
  validateState,
} from 'utils/appState';
import updateURL from 'utils/updateURL';
import sortAnnotationSet from 'utils/sortAnnotationSet';
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

    if (annotationSet) {
      // TODO - Annotations don't currently come in from Aviary
      // in the correct order, so we need to sort them by timestamp
      // Eventually we will drop this.
      sortAnnotationSet(annotationSet);
    }

    const newState = validateState(
      {
        videoPart: newVideoPart || videoPart,
        annotationSet: newAnnotationSet || annotationSet,
        annotation: newAnnotation,
      },
      manifest
    );

    _setAppState(newState);
  };

  const setAnnotation = (newAnnotation: IAnnotationItem | undefined) =>
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

  const fetchManifest = () => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData: IManifest) => {
        setManifest(manifestData);
      });
  };

  // when the manifest URL is available, fetch it
  useEffect(() => {
    fetchManifest();
  }, [manifestURL]);

  // when the app state is updated, update the URL to match
  useEffect(() => {
    if (!manifest) return;
    if (!videoPart || !annotationSet) return;
    stateToURLComponents(appState).then((components) =>
      updateURL(history, components, manifest)
    );
  }, [appState]);

  return (
    <AnnotationViewerContext.Provider
      value={{
        refetchData: fetchManifest,
        playerSize: 'medium',
        manifest,
        videoPart,
        annotationSet,
        // playerPosition,
        annotation,
        sync: syncAnnotationsToPlayer,
        setAnnotation,
        setAnnotationSet,
        // setPlayerPosition,
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
