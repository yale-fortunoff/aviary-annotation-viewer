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

interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: Array<DropdownItem>;
  changeFunc: (id: string) => void;
}

function Dropdown({ items, changeFunc }: DropdownProps) {
  return (
    <select
      onChange={(evt) => {
        changeFunc(evt.target.value);
      }}
    >
      {items.map((item: DropdownItem) => {
        const { id, label } = item;
        return (
          <option key={id} value={id}>
            {label}
          </option>
        );
      })}
    </select>
  );
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
        <Dropdown
          items={partList.map((part) => ({
            ...part,
            label: part.label.en || '',
          }))}
          changeFunc={(id: string) => {
            const matches = partList.filter((part) => part.id === id);
            if (matches.length < 1) {
              return;
            }
            setVideoPart(matches[0]);
          }}
        />
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
