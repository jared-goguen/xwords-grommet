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

import { getLatest, getPuzzle } from '../api/puzzle';

export function loadLatest(count) {
  return async dispatch => {
    const payload = await getLatest(count);
    dispatch({ type: LOAD_LATEST, payload });
  };
};

export function unloadLatest(count) {
  return { type: UNLOAD_LATEST };
};

export function loadPuzzle(path) {
  return async dispatch => {
    const payload = await getPuzzle(path);
    const puzzle = payload.puzzle;
    let entries = puzzle.default.map(row => row.slice());
    dispatch({ type: LOAD_PUZZLE, puzzle, entries });
  };
};

export function unloadPuzzle(count) {
  return { type: UNLOAD_PUZZLE };
};

export function setActive(activeRow, activeColumn, activeDirection) {
  return { type: SET_ACTIVE, activeRow, activeColumn, activeDirection };
};

export function unsetActive() {
  return { type: UNSET_ACTIVE };
};

export function setEntry(row, column, entry) {
  return { type: SET_ENTRY, row, column, entry };
};

export function focusClue(activeRow, activeColumn, activeDirection) {
  return { type: FOCUS_CLUE, activeRow, activeColumn, activeDirection };
};

export function focusCell(activeRow, activeColumn) {
  return { type: FOCUS_CELL, activeRow, activeColumn };
};

export function toggleDirection() {
  return { type: TOGGLE_DIRECTION };
};

export function nextCell() {
  return { type: NEXT_CELL };
};

export function previousCell() {
  return { type: PREVIOUS_CELL };
};

export function moveCell(direction) {
  return { type: MOVE_CELL, direction};
}

export function showErrors(enabled) {
  return { type: SHOW_ERRORS, enabled};
}