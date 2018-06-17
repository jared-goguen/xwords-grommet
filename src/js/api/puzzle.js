import { headers, parseJSON } from './utils';

export function getLatest(count) {
  const options = {
    headers: headers(),
    method: 'GET',
  };
  return fetch(`/api/latest/${count}`, options).then(parseJSON);
}

export function getPuzzle(path) {
  const options = {
    headers: headers(),
    method: 'GET',
  };
  return fetch(`/api/puzzle/${path}`, options).then(parseJSON);
}
