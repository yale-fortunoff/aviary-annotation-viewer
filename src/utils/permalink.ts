import {
  stateToURLComponents,
  URLComponentsToSearchString,
  AppState,
} from './appState';

export default function permalink(state: AppState) {
  return stateToURLComponents(state).then(URLComponentsToSearchString);
}
