import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';
import QComponent from './qt-component';

import actions from '../../flux/actions';
import store from '../../flux/stores';

class Action extends QComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    }
    if (!global.process && window.player) {
      let item = window.player.getPlaying();
      item && actions.syncProgram(item.program_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    let item = window.player.getPlaying();
    item && actions.syncProgram(item.program_id);
  }

  render() {
    let playText = this.props.pid ? '播放' : '播放全部'
    return (
      <div className={cx(this.props.className, s.actionRoot)}>
        {this.state.playing ?
        <button className={s.playBtn} onClick={this.pause.bind(this)}><span className="sprite sprite-pause"></span>暂停</button> :
        <button className={s.playBtn} onClick={this.play.bind(this)}><span className="sprite sprite-play"></span>{playText}</button>}
        <button className={s.mobileBtn} onClick={this.mobile.bind(this)}><span className="sprite-mobile"></span>手机听</button>
        <button className={s.shareBtn} onClick={this.share.bind(this)}><span className="sprite sprite-share"></span>分享</button>
        <button className={s.downloadBtn} onClick={this.download.bind(this)}><span className="sprite sprite-download"></span>下载</button>
      </div>
    )
  }

  play() {
    let { play } = this.props;
    play && play();
    
    if (this.props.cid) return;
  }

  pause() {
    let { pause } = this.props;
    pause && pause();
    if (this.props.cid) return;
  }

  mobile() {
    let { mobile } = this.props;
    mobile && mobile();
  }

  share() {
    let { share } = this.props;
    share && share();
  }

  download() {
    let { download } = this.props;
    download && download();
  }
}

export default withStyles(s)(Action);

