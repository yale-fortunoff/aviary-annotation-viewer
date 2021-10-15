import { getStartAndEndFromVTTItem } from 'api';
import { IAnnotationItem, IAnnotationPage } from 'api/iiifManifest';

export function getAnnotationIndexFromAnnotation(
  annotation: IAnnotationItem,
  annotations: IAnnotationPage
) {
  let ret = 0;
  annotations.items.forEach((item, idx) => {
    if (item.id === annotation.id) {
      ret = idx;
    }
  });

  return ret;
}

export default function getAnnotationIndexFromTime(
  seconds: number,
  annotations: IAnnotationPage
) {
  let ret = 0;
  for (let i = 0; i < annotations.items.length; i += 1) {
    const captionItem = annotations.items[i];
    const { start } = getStartAndEndFromVTTItem(captionItem);

    if (start >= seconds) {
      ret = i;
      break;
    }
  }
  return ret;
}
