import React, { Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';

class PlayButton extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className={cx(this.props.playing ? s.playing : '', s.playButtonRoot)} onClick={this.play.bind(this)}>
        <span className="sprite sprite-list-play"></span>
        <span className="sprite sprite-list-play-hover"></span>
      </button>
    )
  }

  play() {
    console.log('onplay widget clicked', this.props);
    let { play } = this.props;
    play && play();
  }
  
}

export default withStyles(s)(PlayButton);