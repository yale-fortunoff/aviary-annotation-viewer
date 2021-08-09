import Captions from "./Captions";
import Player, { PlayerSize } from "./Player";
import style from "./AnnotationViewer.module.css";
import ControlBar from "./ControlBar/index";
import { useState } from "react";

interface AnnotationViewerProps {
  videoTitle: string;
  videoURL: string;
  transcript: string;
  currentPosition: number;
  hvtID: string;
  currentPartNumber: number;
  partList: Array<number>;
  transcriptURL: string;
  introductionURL: string;
}

function AnnotationViewer(props: AnnotationViewerProps) {
  // State that needs to be passed between child components
  const [playerPosition, __setPlayerPosition] = useState<number>(0);
  const [playerSize, setPlayerSize] = useState<PlayerSize>("medium");
  const [currentFootnoteIndex, setCurrentFootnoteIndex] = useState<number>(0);
  const [syncFootnotesToPlayer, setSyncFootnotesToPlayer] =
    useState<boolean>(true);

  const setPlayerPosition = (seconds: number) => {
    __setPlayerPosition(seconds);
  };

  const disableSynch = () => {
    setSyncFootnotesToPlayer(false);
  };

  const enableSynch = () => {
    setSyncFootnotesToPlayer(true);
  };

  const toggleSynch = () => {
    setSyncFootnotesToPlayer(!syncFootnotesToPlayer);
  };

  return (
    <div className={style.AnnotationViewerContainer}>
      <main className={style.Main}>
        <div
          className={style.PlayerContainer + " " + style[`size-${playerSize}`]}
        >
          <Player
            playerPosition={playerPosition}
            setPlayerPosition={setPlayerPosition}
            size={playerSize}
            sources={[
              {
                src: "/data/video/video-2033-p1of2.mov",
                type: "video/mp4",
              },
            ]}
            tracks={[
              {
                languageCode: "en",
                label: "English",
                src: "/data/captions/transcript-2033-p1of2.webvtt",
              },
            ]}
          />
        </div>
        <div className={style.Gray}>
          {" "}
          <h1 className={style.VideoTitle}>{props.videoTitle}</h1>
        </div>
        <div className={style.Gray}>
          <div className={style.ControlBarContainer}>
            <ControlBar
              introductionURL={props.introductionURL}
              downloadTranscriptURL={props.transcriptURL}
              partList={props.partList}
              hvtID={props.hvtID}
              currentPartNumber={props.currentPartNumber}
            />
          </div>
        </div>

        <div className={style.CaptionsContainer}>
          <Captions
            playerPosition={playerPosition}
            path="/data/footnotes/footnotes-2033-p1of2.json"
            synchronize={syncFootnotesToPlayer}
            enableSynch={enableSynch}
            disableSynch={disableSynch}
            toggleSynch={toggleSynch}
          />
        </div>
      </main>
      {/* <footer className={style.Footer}>Footer</footer> */}
    </div>
  );
}

export default AnnotationViewer;
