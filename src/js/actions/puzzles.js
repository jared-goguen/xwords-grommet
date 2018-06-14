import { LOAD_RECENT, UNLOAD_RECENT } from '../actions';
import { getRecent } from '../api/puzzles';

export function loadRecent(count) {
  return dispatch => {
    getRecent(count)
      .then(payload => {
        dispatch({ type: LOAD_RECENT, payload });
      })
  };
};

export function unloadRecent(count) {
  return { type: UNLOAD_RECENT };
};
