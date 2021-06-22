import { useEffect, useState } from "react";
import styles from "./Captions.module.css";

interface CaptionsProps {
  path: string;
}

interface Caption {
  text: string;
}

function Loading() {
  return <div>LoAdInG...</div>;
}

function Captions(props: CaptionsProps) {
  // return <div className={styles.Captions}>Captions</div>;
  const [captionsData, setCaptionsData] = useState([]);
  useEffect(() => {
    fetch(props.path)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Setting captions data", data);
        setCaptionsData(data);
      });
  }, [props.path]);
  if (captionsData.length < 1) {
    return Loading();
  }
  return (
    <div className={styles.Captions}>
      {captionsData.map((caption: Caption) => (
        <div className={styles.Caption}>{caption.text}</div>
      ))}
    </div>
  );
}

export default Captions;
