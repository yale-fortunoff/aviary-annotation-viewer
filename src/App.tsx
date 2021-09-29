// import React from "react";
import { useEffect, useState } from "react";
import AnnotationViewer from "./AnnotationViewer";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { getVideoConfigFromSlug, IConfig } from "./api";

interface AnnotationViewerFromSlugProps {
  config: IConfig;
}

function AnnotationViewerFromSlug(props: AnnotationViewerFromSlugProps) {
  const { config } = props;
  const { slug } = useParams<{ slug: string }>();

  const videoConfig = getVideoConfigFromSlug(config, slug);
  if (!videoConfig) {
    return <div>Annotation set not found</div>;
  }

  const { callNumber, manifestURL } = videoConfig;

  return (
    <AnnotationViewer
      manifestURL={manifestURL}
      callNumber={callNumber || slug}
    />
  );
}

function App() {
  const [config, setConfig] = useState<IConfig>();

  useEffect(() => {
    fetch("/data/config.json")
      .then((resp) => resp.json())
      .then((config) => setConfig(config));
  }, []);

  if (!config) {
    return <div>Loading site configuration</div>;
  }

  return (
    <Router>
      <Switch>
        <Route path="/av/:slug">
          <AnnotationViewerFromSlug config={config} />
        </Route>
        <Route path="/">
          <div>Home page</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
