import { useEffect, useRef, useState } from "react";
import { getStartAndEndFromVTTItem, getVideoPartFootnotes } from "../../api";
import { IVideoPart, IVTT, IVTTItem } from "../../api/iiifManifest";
import styles from "./Captions.module.css";

interface CaptionsProps {
  path: string;
  playerPosition: number;
  synchronize: boolean;

  videoPart: IVideoPart;

  enableSynch: () => void;
  disableSynch: () => void;
  toggleSynch: () => void;
}

// interface Caption {
//   text: string;
//   start: string;
//   end: string;
// }

// interface Footnote extends Caption {
//   label: string;
// }

// function Loading() {
//   return <div>LoAdInG...</div>;
// }

function getFootnoteFromTime(seconds: number, captions: IVTT) {
  let ret = 0;
  for (let i = 0; i < captions.items.length; i++) {
    const captionItem = captions.items[i];
    const { start } = getStartAndEndFromVTTItem(captionItem);

    if (start >= seconds) {
      ret = i;
      break;
    }
  }
  return ret;
}

function Captions(props: CaptionsProps) {
  // const [captionsData, setCaptionsData] = useState<Array<Footnote>>([]);
  const [activeFootnoteIndex, setActiveFootnoteIndex] = useState<number>(0);
  const footnoteContainerRef = useRef<HTMLOListElement>(null);

  const { playerPosition, synchronize, videoPart } = props;

  // console.log("captions", getVideoPartFootnotes(videoPart));
  const captions = getVideoPartFootnotes(videoPart);

  // useEffect(() => {
  //   fetch(path)
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setCaptionsData(data);
  //     });
  // }, [path]);

  useEffect(() => {
    const newFootnoteIndex = getFootnoteFromTime(playerPosition, captions);
    setActiveFootnoteIndex(newFootnoteIndex);
  }, [playerPosition, activeFootnoteIndex, captions]);

  useEffect(() => {
    if (synchronize && footnoteContainerRef.current) {
      const children = footnoteContainerRef.current.children;
      const child = children[activeFootnoteIndex];
      child.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [playerPosition, activeFootnoteIndex, synchronize]);

  return (
    <div className={styles.CaptionsContainer}>
      {/* <div className={styles.CaptionMeta}>
        {activeFootnoteIndex + 1} of {captionsData.length}
      </div> */}
      <div className={styles.SynchButtonContainer}>
        <button
          className={styles.SynchButton}
          onClick={() => {
            props.toggleSynch();
          }}
        >
          {props.synchronize ? "unsynch" : "synch"}
        </button>
      </div>
      <ol className={styles.CaptionColumn} ref={footnoteContainerRef}>
        {captions.items.map((caption: IVTTItem, idx) => {
          const isActiveFootnote = activeFootnoteIndex === idx;

          return (
            <li
              key={idx}
              className={`${styles.Caption} ${
                isActiveFootnote
                  ? styles.ActiveFootnote
                  : styles.InactiveFootnote
              }`}
            >
              <div className={styles.CaptionLabel}>{idx + 1}</div>
              <div
                className={styles.CaptionText}
                dangerouslySetInnerHTML={{ __html: caption.body.value }}
              ></div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Captions;
