import React, { useEffect, useState } from 'react';
import Captions from './Captions';
import Player, { PlayerSize } from './Player';
import style from './AnnotationViewer.module.css';
import ControlBar from './ControlBar/index';
import {
  getVideoPartAnnotations,
  getVideoPartFootnotes,
  getVideoParts,
  getVideoPartURL,
  getVideoTitleFromManifest,
} from '../api';
import { IAnnotationPage, IManifest, IVideoPart } from '../api/iiifManifest';

interface AnnotationViewerProps {
  manifestURL: string;
  callNumber: string;
  playerSize?: PlayerSize;
}

AnnotationViewer.defaultProps = {
  playerSize: 'medium',
};

function AnnotationViewer(props: AnnotationViewerProps) {
  // State that needs to be passed between child components
  const [playerPosition, __setPlayerPosition] = useState<number>(0);
  // const [currentFootnoteIndex, setCurrentFootnoteIndex] = useState<number>(0);
  const [syncFootnotesToPlayer, setSyncFootnotesToPlayer] =
    useState<boolean>(true);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [manifest, setManifest] = useState<object>();
  const [videoPart, setVideoPart] = useState<IVideoPart>();
  const [footnoteList, setFootnoteList] = useState<Array<IAnnotationPage>>([]);
  const [annotationSet, setAnnotationSet] = useState<IAnnotationPage>();

  const { manifestURL, callNumber, playerSize } = props;

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
        const initialVideoPart = getVideoParts(manifestData as IManifest)[0];
        const criticalEdition = getVideoPartFootnotes(initialVideoPart);
        const firstAnnotationSet = getVideoPartAnnotations(initialVideoPart);
        setVideoPart(initialVideoPart);
        setAnnotationSet(criticalEdition || firstAnnotationSet);
      });
  }, [manifestURL]);

  useEffect(() => {
    if (!videoPart) {
      return;
    }
    setFootnoteList(getVideoPartAnnotations(videoPart));
  }, [videoPart]);

  if (!videoPart) {
    return <div>Loading video part</div>;
  }

  if (!annotationSet) {
    return <div>Loading annotation sets...</div>;
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
            sources={[
              {
                src: getVideoPartURL(videoPart) || '',
                type: 'video/mp4',
              },
            ]}
            videoPart={videoPart}
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
              setVideoPart={setVideoPart}
              currentVideoPart={videoPart}
              footnoteList={footnoteList}
              currentFootnoteSet={annotationSet}
              setFootnotes={setAnnotationSet}
              callNumber={callNumber}
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
            annotationSet={annotationSet}
            // videoPart={videoPart}
          />
        </div>
      </main>
      {/* <footer className={style.Footer}>Footer</footer> */}
    </div>
  );
}

export default AnnotationViewer;
