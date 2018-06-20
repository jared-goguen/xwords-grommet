export const cellIsTrue = (grid, row, column) => {
  let rowArray = grid[row];
  if ( typeof rowArray === 'undefined' ) {
    return false;
  }
  return rowArray[column];
};


export const getActiveState = (action, adjacency) => {
  const { activeRow, activeColumn, activeDirection } = action;

  let row = activeRow, column = activeColumn;

  const incrementor = () => (activeDirection === 'Across' ? column++ : row++);
  const decrementor = () => (activeDirection === 'Across' ? column-- : row--);
  let activeCells = adjacency.map(row => row.map(cell => false));

  // iterate back until first cell not in clue  
  while( cellIsTrue(adjacency, row, column) ) {
    decrementor();
  }

  incrementor();  // get back to first cell in clue
  let clueRow = row, clueColumn = column;

  while( cellIsTrue(adjacency, row, column) ) {
    activeCells[row][column] = true;
    incrementor();
  }

  return { 
    activeRow,
    activeColumn,
    activeDirection,
    activeCells, 
    clueRow, 
    clueColumn 
  };
};


export const getCellInfo = (entries, row, column) => {
  let rowArray = entries[row];
  
  if ( typeof rowArray === 'undefined' ) {
    return {open: false, valid: false, badIndex: true};
  }

  let entry = rowArray[column];
  
  if (typeof entry === 'undefined' ) {
    return {open: false, valid: false, badIndex: true};
  }

  if ( entry === null ) {
    return {open: false, valid: false, badIndex: false};
  }

  return {open: entry === '', valid: true, badIndex: false};
};


export const nextOpenCellInClue = (entries, row, column, direction) => {
  let increment = () => (direction === 'Across' ? column++ : row++);

  let info;
  do {
    increment();
    info = getCellInfo(entries, row, column);
  } while ( !info.open  && info.valid )
  
  if ( info.valid ) {
    return { row, column };
  }

  return null;
};


export const previousCellInClue = (entries, row, column, direction) => {
  let decrement = () => (direction === 'Across' ? column-- : row--);

  decrement();
  let info = getCellInfo(entries, row, column);

  if ( info.valid ) {
    return { row, column };
  }

  return null;
};


export const cellUDLR = (entries, row, column, UDLR) => {
  let incrementor = {
    Up: () => row--,
    Down: () => row++,
    Left: () => column--,
    Right: () => column++,
  }[UDLR];

  let rows = entries.length;
  let columns = entries[0].length;

  let info;
  do {
    incrementor();
    info = getCellInfo(entries, row, column);
  } while ( !info.valid && !info.badIndex );

  if ( info.valid ) {
    return { row, column };
  }

  return null;
};

export const isComplete = (answers, entries) => {
  let rows = answers.length;
  let columns = answers[0].length;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (answers[row][column] !== entries[row][column]) {
        return false;
      }
    }
  }
  return true;
};


export const createReducer = (initialState, handlers) => {
  return (state = initialState, action) => {
    const handler = handlers[action.type];
    if (!handler) return state;
    return { ...state, ...handler(state, action) };
  };
};


export default { createReducer };
