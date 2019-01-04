import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';
import { addEventListener, removeEventListener } from '../../core/DOMUtils';

class QRCode extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._init();
  }

  render() {
    return (
      <div className={s.QRCodeRoot} ref="container">
        <img className={s.bg} src="/images/QR_background.png" alt=""/>
        <img className={s.code} src="/images/QRCode.png" alt=""/>
        <div className={s.info}>
        <div>下载蜻蜓FM</div>
        <div>畅听精彩内容</div>
        </div>
      </div>
    )
  }

  _init() {
    if (!global.process) {
      this._setPosition();
      this._setResize();
    }
  }

  _setPosition() {
    this.refs.container.style.left = 1000 + (window.innerWidth - 1000)/2 + 'px';
    this.refs.container.style.display = 'block';
  }

  _setResize() {
    let self = this;
    addEventListener(window, "optimizedResize", function(e) {
      self._setPosition();
    });
  }
}

export default withStyles(s)(QRCode);

