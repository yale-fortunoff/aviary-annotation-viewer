import React from 'react';
import { getVideoPartTitle } from '../../api';
import { IVideoPart } from '../../api/iiifManifest';
import styles from './ControlBar.module.css';

interface ControlBarProps {
  callNumber: string;
  // currentPartNumber: string;
  partList: Array<IVideoPart>;
  downloadTranscriptURL: string;
  introductionURL: string;
  setVideoPart: (part: IVideoPart) => void;
}

function ControlBar(props: ControlBarProps) {
  const {
    setVideoPart,
    callNumber: hvtID,
    partList,
    downloadTranscriptURL,
    introductionURL,
  } = props;

  return (
    <div className={styles.ControlBar}>
      <div>{hvtID}</div>
      <div>
        <select
          onChange={(evt) => {
            const newPart = partList[Number(evt.target.value)];
            setVideoPart(newPart);
          }}
        >
          {partList.map((part: IVideoPart, idx) => {
            const partNumber = getVideoPartTitle(part);
            // const isCurrentPart = partNumber === currentPartNumber;
            return (
              <option key={part.id} value={idx}>
                {partNumber}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        {' '}
        <a href={introductionURL}>Introduction</a>
      </div>
      <div>
        <a href={downloadTranscriptURL}>Download Transcript</a>
      </div>
    </div>
  );
}

export default ControlBar;
