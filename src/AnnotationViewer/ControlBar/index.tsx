import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hvtID: string;
  currentPartNumber: number;
  partList: Array<number>;
  downloadTranscriptURL: string;
  introductionURL: string;
}

function ControlBar(props: ControlBarProps) {
  const {
    currentPartNumber,
    hvtID,
    partList,
    downloadTranscriptURL,
    introductionURL,
  } = props;

  return (
    <div className={styles.ControlBar}>
      <div>{hvtID}</div>
      <div>
        <select>
          {partList.map((partNumber: number) => {
            const isCurrentPart = partNumber === currentPartNumber;
            console.log(
              "isCurrentPart?",
              isCurrentPart,
              partNumber,
              currentPartNumber
            );
            return <option value={partNumber}>Part {partNumber}</option>;
          })}
        </select>
      </div>
      <div>
        {" "}
        <a href={introductionURL}>Introduction</a>
      </div>
      <div>
        <a href={downloadTranscriptURL}>Download Transcript</a>
      </div>
    </div>
  );
}

export default ControlBar;
