import { IAnnotationItem, IAnnotationPage } from 'api/iiifManifest';
import { getStartAndEndFromVTTItem } from 'utils';

/**
 * Sort an annotation set's items in place. Currently Aviary does not
 * sort these items by timestamp, so we have to do it. Eventually
 * we will drop this
 * @param annotationSet
 * @returns
 */
const sortAnnotationSet = (
  annotationSet: IAnnotationPage | undefined
): void => {
  if (!annotationSet) {
    return;
  }

  annotationSet.items.sort((a: IAnnotationItem, b: IAnnotationItem) => {
    const { start: startA, end: endA } = getStartAndEndFromVTTItem(a);
    const { start: startB, end: endB } = getStartAndEndFromVTTItem(b);

    // Try to compare the start times
    if (startA < startB) return -1;
    if (startA > startB) return 1;

    // If the start times are the same,
    // try sorting by end time
    if (endA < endB) return -1;
    if (endA > endB) return 1;

    // If both are the same, they're
    // equal from a sorting perspective
    return 0;
  });
};
export default sortAnnotationSet;
