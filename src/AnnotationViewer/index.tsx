/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import AnnotationViewer, { AnnotationViewerProps } from './AnnotationViewer';

export default function AnnotationViewerRouter(props: AnnotationViewerProps) {
  const { url } = useRouteMatch();

  // TODO - The URL strategy for this app is potentially complex
  // and needs some planning. This is really just a placeholder
  // to show where in the app the routing will happen.
  // If we want to include permalinks, we will have to represent:
  return (
    <Router>
      <Switch>
        <Route path={`${url}/fn/:footnote`}>
          <AnnotationViewer {...props} />
        </Route>
        <Route path={`${url}/s/:seconds`}>
          <AnnotationViewer {...props} />
        </Route>
        <Route path={`${url}`}>
          <AnnotationViewer {...props} />
        </Route>
      </Switch>
    </Router>
  );

  // return AnnotationViewer(props);
}

// export default AnnotationViewer;
