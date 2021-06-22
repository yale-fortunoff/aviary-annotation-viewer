import React from "react";
import styles from "./Video.module.css";

interface Track {
  label?: string;
  languageCode: string;
  src: string;
}

interface VideoSource {
  src: string;
  type: string;
}

interface VideoProps {
  tracks: Array<Track>;
  sources: Array<VideoSource>;
}

function Video(props: VideoProps) {
  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <video className={styles.Video} controls>
          {props.sources.map((source: VideoSource) => (
            <source src={source.src} type={source.type} />
          ))}
          {props.tracks.map((track: Track) => (
            <track
              label={track.label || track.languageCode}
              kind="subtitles"
              srcLang={track.languageCode}
              src={track.src}
              default
            />
          ))}
        </video>
      </div>
    </React.Fragment>
  );
}

export default Video;
