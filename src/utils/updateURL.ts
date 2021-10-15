// import { IManifest } from 'api/iiifManifest';
import { IManifest } from 'api/iiifManifest';
import { useHistory } from 'react-router-dom';
import deserializeURL, {
  stateToURL,
  URLComponentsToSearchString,
  validateURLComponents,
} from './deserializeURL';
// import deserializeURL from './deserializeURL';

interface URLComponents {
  part?: string;
  set?: string;
  anno?: string;
}

// export function safelyUpdateURL(
//   manifest: IManifest,
//   history: ReturnType<typeof useHistory>,
//   { part, set, anno }: URLComponents
// ) {
//   const params = new URLSearchParams();
//   if (part) params.append('part', part);
//   if (set) params.append('set', set);
//   if (anno) params.append('anno', anno);
//   deserializeURL(params.toString(), manifest);
// }

// // see this for why I'm using this weird type definition
// // for history: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50526
// export default function updateURL(
//   history: ReturnType<typeof useHistory>,
//   { part, set, anno }: URLComponents
// ) {
//   let emptyCount = 3;
//   const params = new URLSearchParams();
//   [
//     { label: 'part', value: part || params.get('part') },
//     { label: 'set', value: set || params.get('set') },
//     { label: 'anno', value: anno || params.get('anno') },
//   ].forEach(({ label, value }) => {
//     params.delete(label);
//     if ((value || '').length > 0) {
//       params.append(label, value || '');
//       if (value) {
//         emptyCount -= 1;
//       }
//     }
//     // prevent updating unless all three components
//     // have values.
//     if (emptyCount > 0) {
//       return;
//     }

//     history.push({ search: params.toString() });
//   });
// }

export default function updateURL(
  history: ReturnType<typeof useHistory>,
  components: URLComponents,
  manifest: IManifest
) {
  deserializeURL(URLComponentsToSearchString(components), manifest).then(
    (state) => {
      stateToURL(state).then((cleanComponents) =>
        history.push({
          search: URLComponentsToSearchString(cleanComponents),
        })
      );
    }
  );

  validateURLComponents(components, manifest).then((cleanComponents) => {
    history.push({ search: URLComponentsToSearchString(cleanComponents) });
  });
}
