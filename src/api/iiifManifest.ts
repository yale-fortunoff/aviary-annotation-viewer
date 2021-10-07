/**
 * This is not meant to be a faithful and complete representation of the IIIF
 * manifest specification. Instead it's only intended to represent the
 * Aviary-flavored IIIF manifests.
 * */

export interface MultilingualValue<V> {
  [lang: string]: V;
}

export type MultilingualString = MultilingualValue<string>;
export interface HasLabel {
  label: MultilingualString;
}

export interface HasItems<T> {
  items: Array<T>;
}

export interface HasID {
  id: string;
}
export interface IAnnotationItem extends HasID {
  body:
    | {
        format: 'text/plain';
        type: 'TextualBody';
        value: string;
      }
    | Array<{
        format: 'text/plain';
        type: 'TextualBody';
        value: string;
      }>;
  target: string;
}

export interface IAnnotationPage
  extends HasLabel,
    HasID,
    HasItems<IAnnotationItem> {}

export interface IVideoPart extends HasLabel, HasID {
  type: 'Canvas';
  annotations: Array<IAnnotationPage>;
  items: Array<{
    items: Array<{
      body: {
        id: string;
      };
      type: 'Video';
      duration: number;
      width: number;
      height: number;
    }>;
  }>;
}

export interface IManifest extends HasItems<IVideoPart>, HasLabel {}
