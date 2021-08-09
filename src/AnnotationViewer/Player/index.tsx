import styles from "./Player.module.css";
import Video from "./Video";

interface Track {
  label?: string;
  languageCode: string;
  src: string;
}

interface VideoSource {
  src: string;
  type: string;
}

interface PlayerProps {
  tracks: Array<Track>;
  sources: Array<VideoSource>;
  size: PlayerSize;
  setPlayerPosition: (seconds: number) => void;
  playerPosition: number;
}

export type PlayerSize = "small" | "medium" | "large";

function Player(props: PlayerProps) {
  return (
    <div className={styles.Player}>
      <Video
        setPlayerPosition={props.setPlayerPosition}
        playerPosition={props.playerPosition}
        tracks={props.tracks}
        sources={props.sources}
      />
    </div>
  );
}

export default Player;
