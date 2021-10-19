import { getVideoPartURL } from 'utils';
import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';
import styles from './Player.module.css';
import Video from './Video';

export type PlayerSize = 'small' | 'medium' | 'large';

function Player() {
  const { videoPart } = useContext(AnnotationViewerContext);

  if (!videoPart) {
    return <div>Loading Video Part</div>;
  }

  const sources = [
    {
      src: videoPart ? getVideoPartURL(videoPart) : '',
      type: 'video/mp4',
    },
  ];

  return (
    <div className={styles.Player}>
      <Video
        videoPart={videoPart}
        // setPlayerPosition={setPlayerPosition}
        // playerPosition={playerPosition}
        sources={sources}
      />
    </div>
  );
}

export default Player;
