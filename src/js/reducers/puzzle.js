import { 
  LOAD_LATEST, 
  UNLOAD_LATEST, 
  LOAD_PUZZLE, 
  UNLOAD_PUZZLE, 
  SET_ACTIVE, 
  UNSET_ACTIVE,
  SET_ENTRY,
  FOCUS_CLUE,
  FOCUS_CELL,
  TOGGLE_DIRECTION,
  NEXT_CELL,
  PREVIOUS_CELL,
  MOVE_CELL,
  SHOW_ERRORS
} from '../actions';

import { 
  createReducer,
  getActiveState, 
  nextOpenCellInClue, 
  previousCellInClue, 
  cellUDLR 
} from './utils';


const initialActiveState = {
  activeRow: 0,
  activeColumn: 0,
  activeDirection: 'Across',
  activeCells: undefined,
  clueRow: 0,
  clueColumn: 0,
};

const initialPuzzleState = {
  current: {},
  entries: undefined,
  puzzleLoaded: false,
  showErrors: false,
};

const initialState = {
  latest: [], 
  ...initialPuzzleState,
  ...initialActiveState
};

const handlers = {
  [LOAD_LATEST]: (state, action) => ({latest: action.payload.puzzles}),

  [UNLOAD_LATEST]: (state, action) => ({latest: []}),

  [LOAD_PUZZLE]: (state, action) => ({
    current: action.puzzle, 
    entries: action.entries, 
    puzzleLoaded: true,
    ...getActiveState(initialActiveState, action.puzzle.adjacency)
  }),

  [UNLOAD_PUZZLE]: (state, action) => ({
    ...initialPuzzleState, 
    ...initialActiveState
  }),

  [SET_ACTIVE]: (state, action) => getActiveState(action, state.current.adjacency),

  [UNSET_ACTIVE]: (state, action) => initialActiveState,

  [SET_ENTRY]: (state, action) => {
    let entries = state.entries.map(row => row.slice());
    entries[action.row][action.column] = action.entry.toUpperCase();
    return { entries };
  },

  [FOCUS_CLUE]: (state, action) => getActiveState(action, state.current.adjacency),

  [FOCUS_CELL]: (state, action) => {
    let activeState = {
      activeRow: action.activeRow,
      activeColumn: action.activeColumn,
      activeDirection: state.activeDirection
    };
    return getActiveState(activeState, state.current.adjacency);
  },

  [TOGGLE_DIRECTION]: (state, action) => {
    let activeState = {
      activeRow: state.activeRow,
      activeColumn: state.activeColumn,
      activeDirection: state.activeDirection === 'Across' ? 'Down' : 'Across'
    };
    return getActiveState(activeState, state.current.adjacency);
  },

  [NEXT_CELL]: (state, action) => {
    const next = nextOpenCellInClue(
      state.entries, 
      state.activeRow, 
      state.activeColumn, 
      state.activeDirection
    );

    if ( next !== null ) {
      return { activeRow: next.row, activeColumn: next.column };
    }
  },

  [PREVIOUS_CELL]: (state, action) => {
    const previous = previousCellInClue(
      state.entries, 
      state.activeRow, 
      state.activeColumn, 
      state.activeDirection
    );

    if ( previous !== null ) {
      return { activeRow: previous.row, activeColumn: previous.column };
    }
  },

  [MOVE_CELL]: (state, action) => {
    const cell = cellUDLR(
      state.entries, 
      state.activeRow, 
      state.activeColumn, 
      action.direction
    );

    if ( cell !== null ) {
      let activeState = {
        activeRow: cell.row,
        activeColumn: cell.column,
        activeDirection: state.activeDirection
      };
      return getActiveState(activeState, state.current.adjacency);
    }
  },

  [SHOW_ERRORS]: (state, action) => ({ showErrors: action.enabled })

};

export default createReducer(initialState, handlers);
