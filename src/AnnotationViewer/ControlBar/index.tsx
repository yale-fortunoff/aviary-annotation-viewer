import React from 'react';
import { IAnnotationPage, IVideoPart } from '../../api/iiifManifest';
import styles from './ControlBar.module.css';

interface ControlBarProps {
  callNumber: string;
  // currentPartNumber: string;
  videoPartList: Array<IVideoPart>;
  setVideoPart: (part: IVideoPart) => void;
  currentVideoPart: IVideoPart;

  downloadTranscriptURL: string;
  introductionURL: string;

  annotationSetList: Array<IAnnotationPage>;
  setAnnotationSet: (annotationSet: IAnnotationPage) => void;
  currentAnnotationSet: IAnnotationPage;
}

interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: Array<DropdownItem>;
  currentItemID: string;
  changeFunc: (id: string) => void;
}

function Dropdown({ currentItemID, items, changeFunc }: DropdownProps) {
  return (
    <select
      defaultValue={currentItemID}
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
    currentVideoPart,
    callNumber: hvtID,
    videoPartList: partList,
    downloadTranscriptURL,
    introductionURL,
    annotationSetList,
    setAnnotationSet,
    currentAnnotationSet,
  } = props;

  return (
    <div className={styles.ControlBar}>
      <div>{hvtID}</div>
      <div>
        <Dropdown
          currentItemID={currentVideoPart.id}
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
        <Dropdown
          currentItemID={currentAnnotationSet.id}
          items={annotationSetList.map((annotation) => ({
            ...annotation,
            label: annotation.label.en || '',
          }))}
          changeFunc={(id: string) => {
            const matches = annotationSetList.filter((fn) => fn.id === id);
            if (matches.length < 1) {
              return;
            }
            setAnnotationSet(matches[0]);
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
