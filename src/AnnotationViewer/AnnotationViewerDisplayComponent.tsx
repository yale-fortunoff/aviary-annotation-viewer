import React, { useContext } from 'react';
import { getVideoTitleFromManifest } from 'utils';
import { v4 as uuid } from 'uuid';
import AnnotationViewerContext from 'context';
import style from './AnnotationViewer.module.css';
import Captions from './Captions';
import ControlBar from './ControlBar';
import { IControlBarLinkItem } from './ControlBar/ControlBar';
import Player from './Player/Player';
import SyncButton from './SyncButton/SyncButton';

interface AnnotationViewerDisplayComponentProps {
  callNumber: string;
  controlBarLinks: Array<IControlBarLinkItem>;
}

export default function AnnotationViewerDisplayComponent({
  callNumber,
  controlBarLinks,
}: AnnotationViewerDisplayComponentProps) {
  const { playerSize, manifest } = useContext(AnnotationViewerContext);

  return (
    <div className={style.AnnotationViewerContainer}>
      <main className={style.Main}>
        <div
          className={`${style.PlayerContainer} ${style[`size-${playerSize}`]}`}
        >
          <Player />
        </div>
        <div className={style.PreambleBlock}>
          <div className={style.ControlBarContainer}>
            <ControlBar links={[]} />
          </div>
          <div className={`${style.TitleBlock}`}>
            <div className={style.LeftSide}>
              <h1 className={style.VideoTitle}>
                {manifest ? getVideoTitleFromManifest(manifest) : '...'}
              </h1>
              <div className={style.LinkTray}>
                <div className={style.CallNumber}>{callNumber}</div>
                {controlBarLinks.map((link) => (
                  <a key={`link-tray-link-${uuid()}`} href={link.href}>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
            <SyncButton />
          </div>
        </div>

        <div className={style.CaptionsContainer}>
          <Captions />
        </div>
      </main>
    </div>
  );
}
