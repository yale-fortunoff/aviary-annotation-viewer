import {
  IManifest,
  IVideoPart,
  IAnnotationPage,
  IAnnotationItem,
} from './iiifManifest';
import { IConfig, IVideoConfigEntry } from './interfaces';

export function getVideoConfigFromSlug(
  config: IConfig,
  slug: string
): IVideoConfigEntry | null {
  const matches = config.videos.filter((v) => v.slug === slug);
  if (matches.length < 1) {
    return null;
  }
  return matches[0];
}

export function getVideoTitleFromManifest(
  manifest: IManifest,
  lang: string = 'en'
) {
  return manifest.label[lang];
}

export function getVideoParts(manifest: IManifest): Array<IVideoPart> {
  return manifest?.items || [];
}

export function getVideoPartTitle(
  videoPart: IVideoPart,
  lang: string = 'en'
): string {
  return videoPart.label[lang];
}

export function getVideoPartURL(videoPart: IVideoPart): string {
  return videoPart.items[0].items[0].body.id;
}

// TODO - Support XML. For now, drop support for it because it includes
// array-type annotation item bodies. Not sure the best way to handle these yet
export const getVideoPartAnnotations = (videoPart: IVideoPart) =>
  videoPart.annotations.filter(
    (annotation) => !annotation.label.en[0].endsWith('.xml')
  );

function getVideoPartAnnotationPageByLabel(
  videoPart: IVideoPart,
  matchFunc: (label: string) => boolean
): Array<IAnnotationPage> {
  return getVideoPartAnnotations(videoPart).filter((annotation) =>
    matchFunc(annotation.label.en[0])
  );
  // TODO - Support XML. For now, just hide it
  // .map((vtt) => ({
  //   items: [],
  //   ...vtt,
  // }));
}

// Get all annotations from a video part that end with .vtt
export function getVideoPartVTTs(
  videoPart: IVideoPart
): Array<IAnnotationPage> {
  return getVideoPartAnnotationPageByLabel(videoPart, (label) =>
    label.endsWith('.vtt')
  );
}

export const getVideoPartCriticalEditionAnnotations = (
  videoPart: IVideoPart
): IAnnotationPage =>
  getVideoPartAnnotationPageByLabel(videoPart, (label) =>
    label.trim().endsWith('Critical Edition')
  )[0];

export function getStartAndEndFromVTTItem(vttItem: IAnnotationItem): {
  start: number;
  end: number;
} {
  const t = vttItem.target.split('#t=').reverse()[0];
  const [start, end] = t.split(',').map((n) => Number(n));

  return { start, end };
}

export function getVTTCueFromIVTTItem(vttItem: IAnnotationItem): VTTCue {
  const { start, end } = getStartAndEndFromVTTItem(vttItem);
  if ('value' in vttItem.body) {
    return new VTTCue(start, end, vttItem.body.value);
  }
  return new VTTCue(start, end, '');
}
