import { IManifest, IVideoPart, IVTT, IVTTItem } from './iiifManifest';
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
  return manifest.items;
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

function getVideoPartAnnotationPageByLabel(
  videoPart: IVideoPart,
  matchFunc: (label: string) => boolean
): Array<IVTT> {
  return videoPart.annotations
    .filter((annotation) => matchFunc(annotation.label.en[0]))
    .map((vtt) => ({
      items: [],
      ...vtt,
    }));
}

// Get all annotations from a video part that end with .vtt
export function getVideoPartVTTs(videoPart: IVideoPart): Array<IVTT> {
  return getVideoPartAnnotationPageByLabel(videoPart, (label) =>
    label.endsWith('.vtt')
  );
}

export const getVideoPartFootnotes = (videoPart: IVideoPart): IVTT =>
  getVideoPartAnnotationPageByLabel(videoPart, (label) =>
    label.trim().endsWith('Critical Edition')
  )[0];

export function getStartAndEndFromVTTItem(vttItem: IVTTItem): {
  start: number;
  end: number;
} {
  const t = vttItem.target.split('#t=').reverse()[0];
  const [start, end] = t.split(',').map((n) => Number(n));

  return { start, end };
}

export function getVTTCueFromIVTTItem(vttItem: IVTTItem): VTTCue {
  const { start, end } = getStartAndEndFromVTTItem(vttItem);
  return new VTTCue(start, end, vttItem.body.value);
}
