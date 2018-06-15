import { LOAD_RECENT, UNLOAD_RECENT } from '../actions';
import { createReducer } from './utils';

const initialState = {recent: []};

const handlers = {
  [LOAD_RECENT]: (state, action) => ({recent: action.payload.puzzles}),
  [UNLOAD_RECENT]: (state, action) => ({recent: []}),
};

export default createReducer(initialState, handlers);
