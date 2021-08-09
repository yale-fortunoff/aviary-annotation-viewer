import { useEffect, useRef, useState } from "react";
import styles from "./Captions.module.css";

interface CaptionsProps {
  path: string;
  playerPosition: number;
  synchronize: boolean;

  enableSynch: () => void;
  disableSynch: () => void;
  toggleSynch: () => void;
}

interface Caption {
  text: string;
  start: string;
  end: string;
}

interface Footnote extends Caption {
  label: string;
}

function Loading() {
  return <div>LoAdInG...</div>;
}

function getTimeFromFootnote(caption: Caption) {
  return Number(caption.start);
}

function getFootnoteFromTime(seconds: number, captions: Array<Caption>) {
  let ret = 0;
  for (let i = 0; i < captions.length; i++) {
    const caption = captions[i];

    if (Number(caption.start) >= seconds) {
      console.log("found: ", i, caption.start, seconds, captions[i]);

      // return i;
      ret = i;
      break;
      // return ret;
    } else {
      console.log("not there yet:", i, caption.start, seconds, caption);
    }
  }
  return ret;
}

function Captions(props: CaptionsProps) {
  // return <div className={styles.Captions}>Captions</div>;
  const [captionsData, setCaptionsData] = useState<Array<Footnote>>([]);
  const [activeFootnoteIndex, setActiveFootnoteIndex] = useState<number>(0);
  // const activeFootnote = useRef<HTMLDivElement>(null);
  const footnoteContainerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    fetch(props.path)
      .then((resp) => resp.json())
      .then((data) => {
        setCaptionsData(data);
      });
  }, [props.path]);

  useEffect(() => {
    const newFootnoteIndex = getFootnoteFromTime(
      props.playerPosition,
      captionsData
    );
    console.log("new footnote index", activeFootnoteIndex, newFootnoteIndex);
    setActiveFootnoteIndex(newFootnoteIndex);
  }, [props.playerPosition, captionsData, activeFootnoteIndex]);

  useEffect(() => {
    if (props.synchronize && footnoteContainerRef.current) {
      const children = footnoteContainerRef.current.children;
      const child = children[activeFootnoteIndex];
      child.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [props.playerPosition, activeFootnoteIndex, props.synchronize]);

  if (captionsData.length < 1) {
    return Loading();
  }

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
        {captionsData.map((caption: Footnote, idx) => {
          const isActiveFootnote = activeFootnoteIndex === idx;
          if (isActiveFootnote) {
            console.log(
              "is active footnote",
              activeFootnoteIndex,
              idx,
              caption.text
            );
          }

          return (
            <li
              key={idx}
              className={`${styles.Caption} ${
                isActiveFootnote
                  ? styles.ActiveFootnote
                  : styles.InactiveFootnote
              }`}
            >
              <div className={styles.CaptionLabel}>{caption.label}</div>
              <div
                className={styles.CaptionText}
                dangerouslySetInnerHTML={{ __html: caption.text }}
              ></div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Captions;
