import {
  getItemByHash,
  getVideoPartAnnotationSets,
  getVideoParts,
} from 'utils';
import {
  IAnnotationItem,
  IAnnotationPage,
  IManifest,
  IVideoPart,
} from 'api/iiifManifest';
import insecureStringHash from './hash';

export interface URLState {
  videoPart?: IVideoPart;
  annotationSet?: IAnnotationPage;
  annotation?: IAnnotationItem;
}

export interface URLComponents {
  part?: string;
  set?: string;
  anno?: string;
}

const defaultVideoPart = (manifestData: IManifest) =>
  getVideoParts(manifestData)[0];
function defaultAnnotationSet(videoPart: IVideoPart) {
  // Look for the critical edition based on label
  const annotationSets = getVideoPartAnnotationSets(videoPart);
  const criticalEdition = annotationSets.find((set) =>
    set.label.en[0].endsWith('Critical Edition')
  );
  const firstSet = annotationSets[0];
  return criticalEdition || firstSet;
}

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

export function stateToURL({
  videoPart,
  annotationSet,
  annotation,
}: URLState): Promise<URLComponents> {
  return Promise.all([
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
    return {
      part: dropIfEmpty(part),
      set: dropIfEmpty(set),
      anno: dropIfEmpty(anno),
    };
  });
}

export function URLComponentsToSearchString({
  part,
  set,
  anno,
}: URLComponents): string {
  const ret = new URLSearchParams();
  if (!part) return ret.toString();
  ret.append('part', part);

  if (!set) return ret.toString();
  ret.append('set', set);

  if (!anno) return ret.toString();
  ret.append('anno', anno);

  return ret.toString();
}

export function validateState(
  state: URLState,
  manifest: IManifest
): Promise<URLState> {
  return stateToURL(state).then((components) =>
    deserializeURL(URLComponentsToSearchString(components), manifest)
  );
}

export function validateURLComponents(
  components: URLComponents,
  manifest: IManifest
): Promise<URLComponents> {
  return deserializeURL(URLComponentsToSearchString(components), manifest).then(
    stateToURL
  );
}

export default function deserializeURL(
  searchString: string,
  manifest: IManifest
): Promise<URLState> {
  const search = new URLSearchParams(searchString);
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
