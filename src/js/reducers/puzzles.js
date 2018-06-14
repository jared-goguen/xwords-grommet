import { LOAD_RECENT, UNLOAD_RECENT } from '../actions';
import { createReducer } from './utils';

const initialState = [];

const handlers = {
  [LOAD_RECENT]: (state, action) => {
    let puzzles = [];
    for (let i in action.payload.puzzles) {
      puzzles.push(action.payload.puzzles[i])
    }
    return puzzles;
  },
  [UNLOAD_RECENT]: (state, action) => [],
};

export default createReducer(initialState, handlers);
