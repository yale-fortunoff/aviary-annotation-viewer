// import { IManifest } from 'api/iiifManifest';
import { IManifest } from 'api/iiifManifest';
import { useHistory } from 'react-router-dom';
import {
  stateToURLComponents,
  URLComponentsToSearchString,
  URLComponentsToValidState,
  validateState,
} from './appState';
// import deserializeURL from './deserializeURL';

interface URLComponents {
  part?: string;
  set?: string;
  anno?: string;
}

export default function updateURL(
  history: ReturnType<typeof useHistory>,
  components: URLComponents,
  manifest: IManifest
) {
  URLComponentsToValidState(components, manifest)
    .then((state) => validateState(state, manifest))
    .then(stateToURLComponents)
    .then(URLComponentsToSearchString)
    .then((searchString) => history.push({ search: searchString }));
}
