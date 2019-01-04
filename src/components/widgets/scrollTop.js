import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';
import Link from '../Link';
import { addEventListener, removeEventListener } from '../../core/DOMUtils';
import { scrollToTop } from '../../core/qt-core';

class ScrollTop extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    if (global.process) return;
    addEventListener(window, 'scroll', (e) => {
      this.setVisible(e);
    })
  }

  render() {
    return (
      <div className={s.scrollTopRoot} ref="wedgets">
        <div role="scroll top" tabIndex="5" className={s.top} onClick={this._scrollTop} ref="top">
          <div className={s['top-pos']}></div>
          <div className={s['top-neg']}>回到顶部</div>
        </div>
      </div>
    )
  }

  setVisible(e) {
    let toTop = document.body.scrollTop || document.documentElement.scrollTop
    if (toTop > window.innerHeight) {
      this.refs.wedgets.style.display = 'block';
    } else {
      this.refs.wedgets.style.display = 'none';
    }
  }

  _scrollTop() {
    scrollToTop();
  }
}

export default withStyles(s)(ScrollTop);

