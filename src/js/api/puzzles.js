import { headers, parseJSON } from './utils';

export function getRecent(count) {
  const options = {
    headers: headers(),
    method: 'GET',
  };
  return fetch(`/api/recent/${count}`, options).then(parseJSON);
}

