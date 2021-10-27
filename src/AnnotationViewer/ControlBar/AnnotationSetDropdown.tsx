import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';
import { getVideoPartAnnotationSets } from 'utils';
import Dropdown from './Dropdown';

export default function AnnotationSetDropdown() {
  const { setAnnotationSet, videoPart, annotationSet, manifest } = useContext(
    AnnotationViewerContext
  );

  if (!manifest || !annotationSet || !videoPart) {
    return <></>;
  }

  const annotationSetList = videoPart
    ? getVideoPartAnnotationSets(videoPart)
    : undefined;

  return (
    <Dropdown
      //   labelText="Annotation Set"
      currentItemID={annotationSet.id}
      items={
        annotationSetList?.map((annotation) => ({
          ...annotation,
          label: annotation.label.en || '',
        })) || []
      }
      changeFunc={(id: string) => {
        if (!annotationSetList) return;
        setAnnotationSet(
          annotationSetList.find((fn) => fn.id === id) || annotationSetList[0]
        );
      }}
    />
  );
}
