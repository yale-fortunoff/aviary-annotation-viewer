import { getItemByHash, getVideoPartAnnotationSets, getVideoParts } from 'api';
import {
  IAnnotationItem,
  IAnnotationPage,
  IManifest,
  IVideoPart,
} from 'api/iiifManifest';
import { useHistory } from 'react-router';

export interface URLState {
  videoPart: IVideoPart;
  annotationSet: IAnnotationPage;
  annotation: IAnnotationItem;
}

const defaultVideoPart = (manifestData: IManifest) =>
  getVideoParts(manifestData)[0];
const defaultAnnotationSet = (videoPart: IVideoPart) =>
  getVideoPartAnnotationSets(videoPart)[0];
const defaultAnnotation = (annotationSet: IAnnotationPage) =>
  annotationSet.items[0];

function defaultState({
  manifest,
  videoPart,
  annotationSet,
  annotation,
}: {
  manifest: IManifest;
  videoPart?: IVideoPart;
  annotationSet?: IAnnotationPage;
  annotation?: IAnnotationItem;
}): URLState {
  const retVideoPart = videoPart || defaultVideoPart(manifest);
  const retAnnotationSet = annotationSet || defaultAnnotationSet(retVideoPart);
  const retAnnotation = annotation || defaultAnnotation(retAnnotationSet);

  return {
    videoPart: retVideoPart,
    annotationSet: retAnnotationSet,
    annotation: retAnnotation,
  };
}

export default function deserializeURL(
  history: ReturnType<typeof useHistory>,
  manifest: IManifest
): Promise<URLState> {
  const search = new URLSearchParams(history.location.search);
  const videoPartHash = search.get('part');
  const annotationSetHash = search.get('set');
  const annotationHash = search.get('anno');

  if (!videoPartHash) {
    return Promise.resolve(defaultState({ manifest }));
  }

  const videoParts = getVideoParts(manifest);
  const ret: URLState = defaultState({ manifest });

  return getItemByHash(videoPartHash, videoParts).then((initialVideoPart) => {
    if (!initialVideoPart) return defaultState({ manifest });

    ret.videoPart = initialVideoPart;

    if (!annotationSetHash)
      return defaultState({ manifest, videoPart: ret.videoPart });

    return getItemByHash(
      annotationSetHash,
      getVideoPartAnnotationSets(initialVideoPart)
    ).then((initialAnnotationSet) => {
      if (!initialAnnotationSet)
        return defaultState({ manifest, videoPart: ret.videoPart });

      ret.annotationSet = initialAnnotationSet;

      if (!annotationHash)
        return defaultState({
          manifest,
          videoPart: ret.videoPart,
          annotationSet: ret.annotationSet,
        });
      return getItemByHash(annotationHash, initialAnnotationSet.items).then(
        (initialAnnotation) => {
          if (!initialAnnotation)
            return defaultState({
              manifest,
              videoPart: ret.videoPart,
              annotationSet: ret.annotationSet,
            });

          return defaultState({
            manifest,
            videoPart: ret.videoPart,
            annotationSet: ret.annotationSet,
            annotation: initialAnnotation,
          });
        }
      );
    });
  });
}
