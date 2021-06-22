import Captions from "./Captions";
import Player from "./Player";
import style from "./AnnotationViewer.module.css";

interface AnnotationViewerProps {
  videoURL: string;
  transcript: string;
  currentPosition: number;
}

function AnnotationViewer(props: AnnotationViewerProps) {
  return (
    <div className={style.AnnotationViewerContainer}>
      <header className={style.Header}>AnnotationViewer</header>
      <main className={style.Main}>
        <div className={style.PlayerContainer}>
          <Player
            sources={[
              {
                src: "/data/video/video-2033-p1of2.mov",
                type: "video/mp4",
              },
            ]}
            tracks={[
              {
                languageCode: "en",
                label: "English",
                src: "/data/captions/transcript-2033-p1of2.webvtt",
              },
            ]}
          />
        </div>
        <div className={style.CaptionsContainer}>
          <Captions path="/data/footnotes/footnotes-2033-p1of2.json" />
        </div>
      </main>
      <footer className={style.Footer}>Footer</footer>
    </div>
  );
}

export default AnnotationViewer;
