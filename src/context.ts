import { PlayerSize } from 'AnnotationViewer/Player/Player';
import {
  IAnnotationItem,
  IAnnotationPage,
  IManifest,
  IVideoPart,
} from 'api/iiifManifest';
import { createContext } from 'react';

export interface IAnnotationViewerContext {
  manifest?: IManifest;
  videoPart?: IVideoPart;
  annotationSet?: IAnnotationPage;
  annotation?: IAnnotationItem;
  playerPosition: number;
  playerSize: PlayerSize;
  sync: boolean;

  setAnnotationSet: (annotationSet: IAnnotationPage) => void;
  setVideoPart: (videoPart: IVideoPart) => void;
  setAnnotation: (annotation: IAnnotationItem) => void;
  setPlayerPosition: (seconds: number) => void;
  toggleSync: () => void;
}

const AnnotationViewerContext = createContext<IAnnotationViewerContext>({
  sync: true,
  playerSize: 'medium',
  playerPosition: 0,

  toggleSync: () => {},
  setAnnotation: () => {},
  setVideoPart: () => {},
  setAnnotationSet: () => {},
  setPlayerPosition: () => {},
});

export default AnnotationViewerContext;
