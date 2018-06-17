import React from 'react';
import { connect } from 'react-redux';
import { focusClue } from '../actions/puzzle';

class Clue extends React.Component {
  /*
  props
    row: Number row number
    column: Number column number
    number: String clue number
    direction: String clue direction
    answer: String clue answer
    text: String clue text
    focus: Boolean active clue
  */
  constructor(props) {
    super(props); 
    this.liRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.focus !== nextProps.focus;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ( this.props.focus ) {
      this.liRef.current.scrollIntoViewIfNeeded(); 
    }
  }

  onClick = (event) => {
    this.props.dispatch(focusClue(
      this.props.row,
      this.props.column,
      this.props.direction
    ));
  }

  render() {
    let className = this.props.focus ? 'clue-highlight' : '';
    return (
      <li 
        onClick={ this.onClick } 
        className={ className } 
        ref={ this.liRef }
      >
        <label>
          <b>{ this.props.number }.</b>
          { this.props.text }
        </label>
      </li>
    );
  }
}

export default connect()(Clue);