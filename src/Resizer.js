import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

export const RESIZER_DEFAULT_CLASSNAME = 'Resizer';

class Resizer extends React.Component {
  render() {
    const {
      className,
      onClick,
      onDoubleClick,
      onMouseDown,
      onTouchEnd,
      onTouchStart,
      resizerClassName,
      split,
      style,
      children,
    } = this.props;
    const classes = [resizerClassName, split, className];

    return (
      <div className={classes.join(' ')}>
        <span
          role="presentation"
          style={style}
          onMouseDown={event => onMouseDown(event)}
          onTouchStart={event => {
            event.preventDefault();
            onTouchStart(event);
          }}
          onTouchEnd={event => {
            event.preventDefault();
            onTouchEnd(event);
          }}
          onClick={event => {
            if (onClick) {
              event.preventDefault();
              onClick(event);
            }
          }}
          onDoubleClick={event => {
            if (onDoubleClick) {
              event.preventDefault();
              onDoubleClick(event);
            }
          }}
        >
          {children}
        </span>
      </div>
    );
  }
}

Resizer.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  style: stylePropType,
  resizerClassName: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Resizer.defaultProps = {
  resizerClassName: RESIZER_DEFAULT_CLASSNAME,
};

export default Resizer;
