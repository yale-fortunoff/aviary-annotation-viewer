import { getVideoPartAnnotationSets, getVideoParts } from 'api';
import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';
import styles from './ControlBar.module.css';
import Dropdown from './Dropdown';

export interface IControlBarLinkItem {
  text: string;
  href: string;
}

interface ControlBarProps {
  links: Array<IControlBarLinkItem>;
}

function ControlBar(props: ControlBarProps) {
  const { links } = props;

  const { setVideoPart, setAnnotationSet, videoPart, annotationSet, manifest } =
    useContext(AnnotationViewerContext);

  if (!manifest || !annotationSet || !videoPart) {
    return <div>Loading</div>;
  }

  const annotationSetList = videoPart
    ? getVideoPartAnnotationSets(videoPart)
    : undefined;

  const partList = getVideoParts(manifest);

  return (
    <div className={`${styles.ControlBar}`}>
      {partList.length > 1 ? (
        <Dropdown
          labelText="Video part"
          currentItemID={videoPart.id}
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
      ) : null}
      <Dropdown
        labelText="Annotation Set"
        currentItemID={annotationSet.id}
        items={
          annotationSetList?.map((annotation) => ({
            ...annotation,
            label: annotation.label.en || '',
          })) || []
        }
        changeFunc={(id: string) => {
          const matches = annotationSetList?.filter((fn) => fn.id === id) || [];
          if (matches.length < 1) {
            return;
          }
          setAnnotationSet(matches[0]);
        }}
      />
      {links.map(({ href, text }: IControlBarLinkItem) => (
        <div key={`${text}-${href}`}>
          <a href={href}>{text}</a>
        </div>
      ))}
    </div>
  );
}

export default ControlBar;
