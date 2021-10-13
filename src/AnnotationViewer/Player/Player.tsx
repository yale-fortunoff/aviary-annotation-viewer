import React from 'react';
import { IVideoPart } from '../../api/iiifManifest';
import styles from './Player.module.css';
import Video from './Video';

interface VideoSource {
  src: string;
  type: string;
}

interface PlayerProps {
  sources: Array<VideoSource>;
  setPlayerPosition: (seconds: number) => void;
  playerPosition: number;

  videoPart?: IVideoPart;
}

Player.defaultProps = {
  videoPart: undefined,
};

export type PlayerSize = 'small' | 'medium' | 'large';

function Player(props: PlayerProps) {
  const { videoPart, setPlayerPosition, playerPosition, sources } = props;

  if (!videoPart) {
    return <div>Loading Video Part</div>;
  }

  return (
    <div className={styles.Player}>
      <Video
        videoPart={videoPart}
        setPlayerPosition={setPlayerPosition}
        playerPosition={playerPosition}
        sources={sources}
      />
    </div>
  );
}

export default Player;
