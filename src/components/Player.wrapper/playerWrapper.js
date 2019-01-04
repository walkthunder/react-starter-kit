import React from 'react';
import QComponent from '../widgets/qt-component';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './playerWrapper.scss';
import Link from '../Link';
import { addEventListener, removeEventListener } from '../../core/DOMUtils';
import DAO from '../../data/qt-radio';
import { constant } from '../../config';
import { getItem } from "../../core/browser-storage";
import store from '../../flux/stores';

class PlayerWrapper extends QComponent {
  constructor(props) {
    super(props);
    this.state = {
      playingId: undefined
    }
  }

  componentDidMount() {
    this.unsub = store.listen(this.onTrigger.bind(this)); 
    let container = this.refs.container;
    if (!global.process) {
      // let player = new Player(container);
      // player.load(null, null, null, false);
      // window.player = player;
      // setTimeout(this.loadFirstProgram, 1000);
      // setTimeout(this.bindPlayerEvent, 3000);
    }
  }

  render() {
    return (
      <div ref='container' className={s.root}></div>
    );
  }

  bindPlayerEvent() {
    const stop = (e) => {
      console.log('player stop propagation called.');
      e.preventDefault();
      e.stopPropagation();
    };
    try {
      addEventListener(document.querySelector('.audio-player .history'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .playlist-collection'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .player-wrapper'), 'click', stop);
    } catch (e) {
      console.log('player fail to load first program or not init properly');
    }
  }

  async loadFirstProgram() {
    let playing = window.player.getPlaying();
    if (!playing && !localStorage.getItem('history')) {
      let { region: region } = await DAO.geo();
      let defaultProgram = constant.defaultProgramMap[region] || 386;
      window.player.play(defaultProgram);
      window.player.pause();
    }
  }

  listenerMap() {
    let self = this;
    return {
      playProgram(data) {
        if ((typeof window !== 'undefined') && self.state.playingId !== data.pid) {
          if (typeof qtWebLog !== 'undefined') {
            const item = self.props.item || {};
            // push data
            qtWebLog.push('_trackEvent', 'play', {
              channel_id: data.cid,
              program_id: data.pid,
              qingting_id: getItem('uat')
            })
          }
          self.setState({
            playingId: data.pid
          })
        }
      }
    }
  }
}

export default withStyles(s)(PlayerWrapper);
