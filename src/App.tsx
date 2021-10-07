import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from 'react-router-dom';
import AnnotationViewer from './AnnotationViewer/AnnotationViewer';
import { getVideoConfigFromSlug } from './api';
import IndexPage from './IndexPage';
import { ControlBarLinkConfig, IConfig } from './api/interfaces';

interface AnnotationViewerFromSlugProps {
  config: IConfig;
}

function AnnotationViewerFromSlug({ config }: AnnotationViewerFromSlugProps) {
  const { slug } = useParams<{ slug: string }>();

  const videoConfig = getVideoConfigFromSlug(config, slug);
  if (!videoConfig) {
    return <div>Annotation set not found</div>;
  }

  const { callNumber, manifestURL } = videoConfig;

  const { controlBarLinks } = config;

  return (
    <AnnotationViewer
      manifestURL={manifestURL}
      callNumber={callNumber || slug}
      controlBarLinks={(controlBarLinks || [])
        .filter(({ property }: ControlBarLinkConfig) => property in videoConfig)
        .map(({ property, label: text }: ControlBarLinkConfig) => {
          const href = videoConfig[property];
          if (href === undefined) {
            // allowing console use for misconfigurations
            // TODO - should abstract this so we can just
            // make the no-console exception once
            // eslint-disable-next-line no-console
            console.warn(
              `Property '${property}' not found in link config:`,
              videoConfig
            );
          }
          return {
            href,
            text,
          };
        })}
    />
  );
}

function App() {
  const [config, setConfig] = useState<IConfig>();

  useEffect(() => {
    fetch('/data/config.json')
      .then((resp) => resp.json())
      .then((configData) => setConfig(configData));
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
          <IndexPage config={config} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
