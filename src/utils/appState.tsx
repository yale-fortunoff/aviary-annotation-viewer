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

// the serializable state of the app
// TODO - Should playback position be
// included or inferred from annotation?
export interface AppState {
  videoPart?: IVideoPart;
  annotationSet?: IAnnotationPage;
  annotation?: IAnnotationItem;
}

// a serialized representation of
// the app state
export interface URLComponents {
  part?: string;
  set?: string;
  anno?: string;
}

// get the default video part (first one) from a manifest
const defaultVideoPart = (manifestData: IManifest) =>
  getVideoParts(manifestData)[0];

// get the default annotation set from a manifest
// prefrs any with "Critical Edition" in the
// label.en field, otherwise defaults to the first
// available annotation set
const defaultAnnotationSet = (videoPart: IVideoPart) => {
  // Look for the critical edition based on label
  const annotationSets = getVideoPartAnnotationSets(videoPart);
  const criticalEdition = annotationSets.find((set) =>
    set.label.en[0].endsWith('Critical Edition')
  );
  const firstSet = annotationSets[0];
  return criticalEdition || firstSet;
};

// get the default annotation (first one) from an annotation set
const defaultAnnotation = (annotationSet: IAnnotationPage) =>
  annotationSet.items[0];

// return a complete app state from a partial one, using
// the manifest to fill in the blanks
function defaultState(manifest: IManifest, state: AppState): AppState {
  const retVideoPart = state.videoPart || defaultVideoPart(manifest);
  const retAnnotationSet =
    state.annotationSet || defaultAnnotationSet(retVideoPart);
  const retAnnotation = state.annotation || defaultAnnotation(retAnnotationSet);

  return {
    videoPart: retVideoPart,
    annotationSet: retAnnotationSet,
    annotation: retAnnotation,
  };
}

export function searchStringToURLComponents(
  searchString: string
): URLComponents {
  const params = new URLSearchParams(searchString);

  return {
    part: params.get('part') || undefined,
    set: params.get('set') || undefined,
    anno: params.get('anno') || undefined,
  };
}

export function stateToURLComponents({
  videoPart,
  annotationSet,
  annotation,
}: AppState): Promise<URLComponents> {
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

export function validateURLComponents(
  components: URLComponents,
  manifest: IManifest
): Promise<URLComponents> {
  return URLComponentsToValidState(components, manifest)
    .then((state) => validateState(state, manifest))
    .then(stateToURLComponents);
}

export function URLComponentsToValidState(
  { part, set, anno }: URLComponents,
  manifest: IManifest
): Promise<AppState> {
  // if there's no video part hash, just resolve the default state
  if (!part) {
    return Promise.resolve(defaultState(manifest, {}));
  }

  return getItemByHash(part, getVideoParts(manifest)).then((videoPart) => {
    // if the video part is undefined it's not a valid state
    // or if there's no annotation set, then we're done
    if (!videoPart || !set) return Promise.resolve(defaultState(manifest, {}));

    // continue. try to resolve the annotation set
    return getItemByHash(set, getVideoPartAnnotationSets(videoPart)).then(
      (annotationSet: IAnnotationPage) => {
        // if the annotationSet is undefined it's invalid
        // or if anno is not defined, we're done
        if (!annotationSet || !anno)
          return Promise.resolve(defaultState(manifest, { videoPart }));

        // continue. try to resolve the annotation
        return getItemByHash(anno, annotationSet.items).then((annotation) => {
          // if the annotation is undefined, it's invalid
          if (!annotation)
            return Promise.resolve(
              defaultState(manifest, { videoPart, annotationSet })
            );

          // otherwise, we're done
          return Promise.resolve(
            defaultState(manifest, { videoPart, annotationSet, annotation })
          );
        });
      }
    );
  });
}

export function validateState(
  { videoPart, annotationSet, annotation }: AppState,
  manifest: IManifest
): AppState {
  // If there's no video part specified, return the default state
  if (!videoPart) {
    return defaultState(manifest, {});
  }

  // If the video part is not in the manifest, abort.
  // If this does happen we've got big problems.
  const videoParts = getVideoParts(manifest);
  if (!videoParts.find((part) => part.id === videoPart.id)) {
    return defaultState(manifest, {});
  }

  // If there's no annotation set, return the default state for
  // the video part
  if (!annotationSet) {
    return defaultState(manifest, { videoPart });
  }

  // If the annotation set doesn't match, return the default state
  // for the video part
  const annotationSets = getVideoPartAnnotationSets(videoPart);
  if (!annotationSets.find((set) => set.id === annotationSet.id)) {
    return defaultState(manifest, { videoPart });
  }

  // If there's no annotation, return the default state for
  // the video part and annotation set
  if (!annotation) {
    return defaultState(manifest, { videoPart, annotationSet });
  }

  // If the annotation is not in the annotation set, return the
  // default state for the video part and annotation set
  if (!annotationSet.items.find((item) => item.id === annotation.id)) {
    return defaultState(manifest, { videoPart, annotationSet });
  }

  // All checks passed, the state is valid
  return {
    videoPart,
    annotationSet,
    annotation,
  };
}
