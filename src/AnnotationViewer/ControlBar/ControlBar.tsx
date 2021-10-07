import React from 'react';
import { IAnnotationPage, IVideoPart } from '../../api/iiifManifest';
import styles from './ControlBar.module.css';
import Dropdown from './Dropdown';

export interface ControlBarLinkItem {
  text: string;
  href: string;
}

export interface ControlBarLinkProps {
  linkItems: Array<ControlBarLinkItem>;
}

interface ControlBarProps {
  // currentPartNumber: string;
  videoPartList: Array<IVideoPart>;
  setVideoPart: (part: IVideoPart) => void;
  currentVideoPart: IVideoPart;

  // downloadTranscriptURL: string;
  // introductionURL: string;

  links: Array<ControlBarLinkItem>;

  annotationSetList: Array<IAnnotationPage>;
  setAnnotationSet: (annotationSet: IAnnotationPage) => void;
  currentAnnotationSet: IAnnotationPage;
}

function ControlBar(props: ControlBarProps) {
  const {
    setVideoPart,
    currentVideoPart,
    videoPartList: partList,
    annotationSetList,
    setAnnotationSet,
    currentAnnotationSet,
    links,
  } = props;

  return (
    <div className={`${styles.ControlBar}`}>
      <div>
        <Dropdown
          labelText="Video part"
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
          labelText="Annotation Set"
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
      {links.map(({ href, text }: ControlBarLinkItem) => (
        <div key={`${text}-${href}`}>
          <a href={href}>{text}</a>
        </div>
      ))}
    </div>
  );
}

export default ControlBar;
