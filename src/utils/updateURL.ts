import { useHistory } from 'react-router-dom';

// see this for why I'm using this weird type definition
// for history: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50526
export default function updateURL(
  history: ReturnType<typeof useHistory>,
  {
    part,
    set,
    anno,
  }: {
    part?: string;
    set?: string;
    anno?: string;
  }
) {
  let emptyCount = 3;
  const params = new URLSearchParams(history.location.search);
  [
    { label: 'part', value: part || params.get('part') },
    { label: 'set', value: set || params.get('set') },
    { label: 'anno', value: anno || params.get('anno') },
  ].forEach(({ label, value }) => {
    params.delete(label);
    if ((value || '').length > 0) {
      params.append(label, value || '');
      if (value) {
        emptyCount -= 1;
      }
    }
    // prevent updating unless all three components
    // have values.
    if (emptyCount > 0) {
      return;
    }
    history.push({ search: params.toString() });
  });
}
