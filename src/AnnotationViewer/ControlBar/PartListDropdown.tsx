import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';
import { getVideoParts } from 'utils';
import Dropdown from './Dropdown';

export default function PartListDropdown() {
  const { setVideoPart, videoPart, manifest, ignoreVideoPartLabels } =
    useContext(AnnotationViewerContext);

  if (!videoPart || !manifest) {
    return <></>;
  }

  const partList = getVideoParts(manifest);

  return (
    <Dropdown
      currentItemID={videoPart.id}
      items={partList.map((part, idx) => {
        const label = ignoreVideoPartLabels
          ? `Part ${idx + 1}`
          : part.label.en || '';

        return {
          ...part,
          label,
        };
      })}
      changeFunc={(id: string) => {
        const newVideoPart = partList.find((part) => part.id === id);
        if (newVideoPart) setVideoPart(newVideoPart);
      }}
    />
  );
}
