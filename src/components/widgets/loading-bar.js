import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';

class LoadingBar extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.loadingBarRoot}>
      </div>
    )
  }
  
}

export default withStyles(s)(LoadingBar);