// import React from "react";
import AnnotationViewer from "./AnnotationViewer";

function App() {
  return (
    <AnnotationViewer
      videoTitle={"Esther F. Holocaust Testimony"}
      currentPosition={0}
      videoURL=""
      transcript=""
      currentPartNumber={1}
      partList={[1, 2]}
      transcriptURL=""
      introductionURL=""
      hvtID="HVT-2033"
    ></AnnotationViewer>
  );
}

export default App;
