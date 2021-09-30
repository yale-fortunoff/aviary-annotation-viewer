import React, { useEffect, useState } from 'react';
import Captions from './Captions';
import Player, { PlayerSize } from './Player';
import style from './AnnotationViewer.module.css';
import ControlBar from './ControlBar/index';
import {
  getVideoParts,
  getVideoPartURL,
  getVideoTitleFromManifest,
} from '../api';
import { IManifest, IVideoPart } from '../api/iiifManifest';

interface AnnotationViewerProps {
  manifestURL: string;
  callNumber: string;
}

function AnnotationViewer(props: AnnotationViewerProps) {
  // State that needs to be passed between child components
  const [playerPosition, __setPlayerPosition] = useState<number>(0);
  const playerSize: PlayerSize = 'medium';
  // const [currentFootnoteIndex, setCurrentFootnoteIndex] = useState<number>(0);
  const [syncFootnotesToPlayer, setSyncFootnotesToPlayer] =
    useState<boolean>(true);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [manifest, setManifest] = useState<object>();
  const [videoPart, setVideoPart] = useState<IVideoPart>();

  const { manifestURL, callNumber } = props;

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

  useEffect(() => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData) => {
        setManifest(manifestData);
        setVideoTitle(getVideoTitleFromManifest(manifestData));
        setVideoPart(getVideoParts(manifest as IManifest)[0]);
      });
  }, [manifestURL]);

  if (!videoPart) {
    return <div>Loading video part</div>;
  }

  return (
    <div className={style.AnnotationViewerContainer}>
      <main className={style.Main}>
        <div
          className={`${style.PlayerContainer} ${style[`size-${playerSize}`]}`}
        >
          <Player
            playerPosition={playerPosition}
            setPlayerPosition={setPlayerPosition}
            size={playerSize}
            sources={[
              {
                src: getVideoPartURL(videoPart) || '',
                type: 'video/mp4',
              },
            ]}
            videoPart={videoPart}
            tracks={[]}
          />
        </div>
        <div className={style.Gray}>
          {' '}
          <h1 className={style.VideoTitle}>{videoTitle}</h1>
        </div>
        <div className={style.Gray}>
          <div className={style.ControlBarContainer}>
            <ControlBar
              introductionURL=""
              downloadTranscriptURL=""
              partList={getVideoParts(manifest as IManifest)}
              callNumber={callNumber}
              setVideoPart={setVideoPart}
            />
          </div>
        </div>

        <div className={style.CaptionsContainer}>
          <Captions
            playerPosition={playerPosition}
            synchronize={syncFootnotesToPlayer}
            enableSynch={enableSynch}
            disableSynch={disableSynch}
            toggleSynch={toggleSynch}
            videoPart={videoPart}
          />
        </div>
      </main>
      {/* <footer className={style.Footer}>Footer</footer> */}
    </div>
  );
}

export default AnnotationViewer;
