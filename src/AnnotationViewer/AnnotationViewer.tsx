import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router';
import Captions from './Captions/Captions';
import Player, { PlayerSize } from './Player/Player';
import style from './AnnotationViewer.module.css';
import ControlBar, { ControlBarLinkItem } from './ControlBar/ControlBar';
import {
  getVideoPartAnnotations,
  getVideoPartCriticalEditionAnnotations,
  getVideoParts,
  getVideoPartURL,
  getVideoTitleFromManifest,
} from '../api';
import { IAnnotationPage, IManifest, IVideoPart } from '../api/iiifManifest';
import ToggleButton from './ToggleButton/ToggleButton';

export interface AnnotationViewerProps {
  manifestURL: string;
  callNumber: string;
  playerSize?: PlayerSize;
  controlBarLinks: Array<ControlBarLinkItem>;
}

AnnotationViewer.defaultProps = {
  playerSize: 'medium',
};

function AnnotationViewer(props: AnnotationViewerProps) {
  const { seconds: initialSeconds } = useParams<{ seconds: string }>();
  // State that needs to be passed between child components
  const [playerPosition, __setPlayerPosition] = useState<number>(
    Number(initialSeconds) || 0
  );
  const [syncAnnotationsToPlayer, setSyncAnnotationsToPlayer] =
    useState<boolean>(true);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [manifest, setManifest] = useState<object>();
  const [videoPart, setVideoPart] = useState<IVideoPart>();
  const [annotationSetList, setAnnotationSetList] = useState<
    Array<IAnnotationPage>
  >([]);
  const [annotationSet, setAnnotationSet] = useState<IAnnotationPage>();

  const { manifestURL, callNumber, playerSize, controlBarLinks } = props;

  const setPlayerPosition = (seconds: number) => {
    __setPlayerPosition(seconds);
  };

  const toggleSynch = () => {
    setSyncAnnotationsToPlayer(!syncAnnotationsToPlayer);
  };

  useEffect(() => {
    fetch(manifestURL)
      .then((response) => response.json())
      .then((manifestData) => {
        setManifest(manifestData);
        setVideoTitle(getVideoTitleFromManifest(manifestData));
        const initialVideoPart = getVideoParts(manifestData as IManifest)[0];
        const criticalEdition =
          getVideoPartCriticalEditionAnnotations(initialVideoPart);
        const firstAnnotationSet = getVideoPartAnnotations(initialVideoPart);
        setVideoPart(initialVideoPart);
        setAnnotationSet(criticalEdition || firstAnnotationSet);
      });
  }, [manifestURL]);

  useEffect(() => {
    if (!videoPart) {
      return;
    }
    setAnnotationSetList(getVideoPartAnnotations(videoPart));
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
        <div className={style.PreambleBlock}>
          <div className={style.ControlBarContainer}>
            <ControlBar
              videoPartList={getVideoParts(manifest as IManifest)}
              setVideoPart={setVideoPart}
              currentVideoPart={videoPart}
              annotationSetList={annotationSetList}
              currentAnnotationSet={annotationSet}
              setAnnotationSet={setAnnotationSet}
              links={[]}
            />
          </div>
          <div className={`${style.TitleBlock}`}>
            <div className={style.LeftSide}>
              <h1 className={style.VideoTitle}>{videoTitle}</h1>
              <div className={style.LinkTray}>
                <div className={style.CallNumber}>{callNumber}</div>
                {controlBarLinks.map((link) => (
                  <a key={`link-tray-link-${uuid()}`} href={link.href}>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
            <ToggleButton
              toggleFunc={toggleSynch}
              active={syncAnnotationsToPlayer}
              labelText="Synchronize Annotations"
            />
          </div>
        </div>

        <div className={style.CaptionsContainer}>
          <Captions
            playerPosition={playerPosition}
            synchronize={syncAnnotationsToPlayer}
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
