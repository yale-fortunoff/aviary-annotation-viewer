import { getStartAndEndFromVTTItem } from 'utils';
import { IAnnotationItem, IAnnotationPage } from 'api/iiifManifest';

export function getAnnotationIndexFromAnnotation(
  annotation: IAnnotationItem,
  annotations: IAnnotationPage
) {
  return annotations.items.findIndex((item) => item.id === annotation.id) || 0;
}

export default function getAnnotationIndexFromTime(
  seconds: number,
  annotations: IAnnotationPage
) {
  return (
    annotations.items.findIndex(
      (item) => getStartAndEndFromVTTItem(item).start >= Math.floor(seconds)
    ) || 0
  );
}
