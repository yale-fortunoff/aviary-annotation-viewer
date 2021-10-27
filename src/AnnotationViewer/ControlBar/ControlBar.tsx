import AnnotationViewerContext from 'context';
import React, { useContext } from 'react';
import styles from './ControlBar.module.css';
import PartListDropdown from './PartListDropdown';
import AnnotationSetDropdown from './AnnotationSetDropdown';

export interface IControlBarLinkItem {
  text: string;
  href: string;
}

interface ControlBarProps {
  links: Array<IControlBarLinkItem>;
}

function ControlBar(props: ControlBarProps) {
  const { links } = props;

  const { videoPart, annotationSet, manifest } = useContext(
    AnnotationViewerContext
  );

  if (!manifest || !annotationSet || !videoPart) {
    return <div>Loading</div>;
  }

  return (
    <div className={`${styles.ControlBar}`}>
      <PartListDropdown />
      <AnnotationSetDropdown />
      {links.map(({ href, text }: IControlBarLinkItem) => (
        <div key={`${text}-${href}`}>
          <a href={href}>{text}</a>
        </div>
      ))}
    </div>
  );
}

export default ControlBar;
