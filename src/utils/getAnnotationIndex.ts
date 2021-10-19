import { getStartAndEndFromVTTItem } from 'utils';
import { IAnnotationItem, IAnnotationPage } from 'api/iiifManifest';

export function getAnnotationIndexFromAnnotation(
  annotations: IAnnotationPage,
  annotation?: IAnnotationItem
): number {
  if (!annotation) return -1;
  return annotations.items.findIndex((item) => item.id === annotation.id) || 0;
}

/**
 * Find the last annotation whose start time is equal to or less
 * than the given seconds
 * @param annotations
 * @param seconds
 * @returns
 */
export default function getAnnotationIndexFromTime(
  annotations: IAnnotationPage,
  seconds: number
): number {
  let ret = -1;
  for (let i = 0; i < annotations.items.length; i += 1) {
    const { start: itemStart } = getStartAndEndFromVTTItem(
      annotations.items[i]
    );
    if (itemStart > seconds) break;
    ret = i;
  }
  return ret;
}
