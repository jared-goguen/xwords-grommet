import React, { Component, PropTypes } from 'react';
import SVGIcon from 'grommet/components/SVGIcon';



class Logo extends Component {
  render() {
    let fillStyle = {fill: this.props.mainColor};
    let emptyStyle = {fill: this.props.altColor};
    return (
      <svg 
        style={ {stroke: this.props.mainColor} }
        width={this.props.width + 'px'} 
        height={this.props.height + 'px'} 
        viewBox='5 5 50 50' 
        x='0px' 
        y='0px'
      >
        <rect height='10' className='logo-rect-00' width='10' x='35' y='35' style={fillStyle} />
        <rect height='10' className='logo-rect-01' width='10' x='25' y='35' style={emptyStyle} />
        <rect height='10' className='logo-rect-02' width='10' x='15' y='35' style={fillStyle} />
        <rect height='10' className='logo-rect-10' width='10' x='35' y='25' style={emptyStyle} />
        <rect height='10' className='logo-rect-11' width='10' x='25' y='25' style={fillStyle} />
        <rect height='10' className='logo-rect-12' width='10' x='15' y='25' style={emptyStyle} />
        <rect height='10' className='logo-rect-20' width='10' x='35' y='15' style={fillStyle} />
        <rect height='10' className='logo-rect-21' width='10' x='25' y='15' style={emptyStyle} />
        <rect height='10' className='logo-rect-22' width='10' x='15' y='15' style={fillStyle} />
      </svg>
    );  
  }
}

Logo.defaultProps = {
  height: 75,
  width: 75,
  mainColor: '#865CD6',
  altColor: '#FFFFFF'
};

Logo.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  mainColor: PropTypes.string,
  altColor: PropTypes.string
};


export default Logo;