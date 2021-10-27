import React, { useContext } from 'react';
import { getVideoTitleFromManifest } from 'utils';
import { v4 as uuid } from 'uuid';
import AnnotationViewerContext from 'context';
import style from './AnnotationViewer.module.css';
import Captions from './Captions';
import { IControlBarLinkItem } from './ControlBar/ControlBar';
import Player from './Player/Player';
import SyncButton from './SyncButton/SyncButton';
import PartListDropdown from './ControlBar/PartListDropdown';
import AnnotationSetDropdown from './ControlBar/AnnotationSetDropdown';

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
          <div className={`${style.TitleBlock}`}>
            <h1 className={style.VideoTitle}>
              {manifest ? getVideoTitleFromManifest(manifest) : '...'}
            </h1>
          </div>
          <div className={style.SubtitleBlock}>
            <div className={style.LeftSide}>
              <div className={style.CallNumber}>{callNumber}</div>
              <PartListDropdown />
              <AnnotationSetDropdown />
            </div>
            <div className={style.RightSide}>
              <div className={style.LinkTray}>
                {controlBarLinks.map((link) => (
                  <a key={`link-tray-link-${uuid()}`} href={link.href}>
                    {link.text}
                  </a>
                ))}
                <SyncButton />
              </div>
            </div>
          </div>
        </div>

        <div className={style.CaptionsContainer}>
          <Captions />
        </div>
      </main>
    </div>
  );
}
