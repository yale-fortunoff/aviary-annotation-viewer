import React from 'react';
import { PlayerSize } from '../Player';

interface ControlBarProps {
  setPlayerSize: (size: PlayerSize) => void;
  playerSize: PlayerSize;
}

function ControlBar(props: ControlBarProps) {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          props.setPlayerSize(
            props.playerSize === 'medium' ? 'small' : 'medium'
          );
        }}
      >
        size
      </button>
    </div>
  );
}

export default ControlBar;
