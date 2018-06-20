import React from 'react';
import { connect } from 'react-redux';

import { 
  setEntry,
  focusCell,
  toggleDirection,
  nextCell,
  previousCell,
  moveCell,
} from '../actions/puzzle';

const inputFilter = /^[A-Za-z0-9]$/;

class Cell extends React.Component {
  /*
  props
    row: Number row number
    column: Number column number
    number: Number clue number
    answer: Character answer
    active: Boolean in current clue
    entry: Character user entry
  */
  constructor(props) {
    super(props);
    this.type = this.props.answer === '.' ? 'blank' : 'cell';
    this.autoFocus = this.props.row === 0 && this.props.column === 0;
    this.inputRef = React.createRef();

    this.keyHandlers = {
      ArrowUp: this.triggerMoveUp,
      ArrowDown: this.triggerMoveDown,
      ArrowLeft: this.triggerMoveLeft,
      ArrowRight: this.triggerMoveRight,
      Backspace: this.onBackspacePress,
      ' ': this.triggerToggle,
    };
  }

  onBackspacePress = () => {
    this.updateEntry('');
    this.props.dispatch(previousCell());
  }

  triggerMoveUp = () => {
    this.props.dispatch(moveCell('Up'));
  }

  triggerMoveDown = () => {
    this.props.dispatch(moveCell('Down'));
  }

  triggerMoveLeft = () => {
    this.props.dispatch(moveCell('Left'));
  }

  triggerMoveRight = () => {
    this.props.dispatch(moveCell('Right'));
  }

  updateEntry = (value) => {
    if ( value.length == 0 || value.match(inputFilter) ) {
      this.props.dispatch(setEntry(this.props.row, this.props.column, value));
    }
  }

  onFocus = (event) => {
    this.props.dispatch(focusCell(this.props.row, this.props.column));
  }

  triggerToggle = (event) => {
    this.props.dispatch(toggleDirection());
  }

  triggerNextCell = () => {
    this.props.dispatch(nextCell());
  }

  triggerPreviousCell = () => {
    this.props.dispatch(previousCell());
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( this.props.focus === nextProps.focus &&
         this.props.active === nextProps.active &&
         this.props.entry === nextProps.entry &&
         this.props.showErrors === nextProps.showErrors && 
         this.props.complete === nextProps.complete
      ) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ( this.props.focus ) {
      this.inputRef.current.focus();
    }
  }

  onChange = (event) => {
    event.preventDefault();
  }

  onClick = (event) => {
    if ( this.props.focus ) {
      this.triggerToggle();
    }
  }

  onKeyPress = (event) => {
    let key = event.key;
    let keyHandler = this.keyHandlers[key];

    if (typeof keyHandler !== 'undefined') {
      return keyHandler();
    }

    if ( key.match(inputFilter) ) {
      this.updateEntry(key);
      this.triggerNextCell();
    }
  }

  render() {
    let outerClassName = this.type;
    let innerClassName = 'cell-input '
    innerClassName += this.props.focus ? 'cell-highlight ' : '';
    innerClassName += (!this.props.focus && this.props.active) ? 'cell-active ' : '';

    if (
      this.props.showErrors &&
      this.props.entry !== '' &&
      this.props.entry !== null &&
      this.props.entry !== this.props.answer
    ) {
      innerClassName += 'cell-error ';
    }

    if (this.props.complete) {
      innerClassName = 'cell-input cell-complete';
    }

    return (
      <td className={ outerClassName }>
        <div>
          { this.props.number !== undefined ?
            <span className='clue-label'>{ this.props.number }</span>
          : null }

          { this.type === 'cell' ?
            <input
              className={ innerClassName.trim() }
              type='text'
              id={ 'cell-' + this.props.row + '-' + this.props.column }
              maxLength='1'
              onFocus={ this.onFocus }
              onMouseDown={ this.onClick }
              onChange={ this.onChange }
              onKeyDown={ this.onKeyPress }
              ref={ this.inputRef }
              value={ this.props.entry }
              autoFocus={ this.autoFocus }
            />
          : null }
        </div>
      </td>
    );
  }
}

const select = (state, prevProps) => {
  const focus = (
    state.puzzle.activeRow === prevProps.row &&
    state.puzzle.activeColumn === prevProps.column
  );
  const showErrors = state.puzzle.showErrors;
  const complete = state.puzzle.complete;
  return { focus, showErrors, complete };
};

export default connect(select)(Cell);
