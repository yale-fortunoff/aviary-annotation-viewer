import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';

import ToggleButton from './ToggleButton';

export default function SyncButton() {
  const { sync, toggleSync } = useContext(AnnotationViewerContext);

  return (
    <ToggleButton labelText="Sync" active={sync} toggleFunc={toggleSync} />
  );
}
