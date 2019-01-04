import Reflux from 'reflux';
import actions from '../flux/actions';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import compact from 'lodash/compact';
import remove from 'lodash/remove';
import QtRequest from '../data/qt-request';
import { addEventListener } from '../core/DOMUtils';
import { getItem } from '../core/browser-storage';
import { constant } from '../config';
import DAO from '../data/qt-radio';

let programCache = {};
let channelCache = {};
let searchCache = {};

const qtBridgeMap = {
  'play': () => {
  },

  'pause': () => {
  },

  'share': () => {
  },

  'download': () => {
  },

  'syncHistory': () => {
  }
};

let Store = Reflux.createStore({
  init: function() {

  },

  listenables: actions,
  onGetRadioChannels: async function(params) {
    let data = await DAO.radioChannelsByCategory(params);
    this.trigger('getRadioChannels', data);
  },
  onGetFrontRadioSection: async () => {
    let data = await DAO.getFrontRadioSection();
    this.trigger('getFrontRadioSection', data);
  },


  onGetProgramInfo: function(cid, pid) {
    QtRequest.get('wapi.program_info', {
      channel_id: cid,
      program_id: pid
    })
    .then((result) => {
      this.trigger('getProgramInfo', result);
    });

  },

  onGetChannelInfo: function(cid, pid) {
    QtRequest.get('wapi.channel_info', {
      channel_id: cid
    })
    .then((result) => {
      let podcaster = result.podcasters[0]['user_id'];
      actions.getProgramComments(podcaster, cid, pid);
      this.trigger('getChannelInfo', result);
    });
  },

  onGetProgramComments: function(pdid, cid, pid) {
    programCache = {
      pdid: pdid,
      cid: cid,
      pid: pid
    };
    QtRequest.get('wsq.program_comments', {
      podcast_id: pdid,
      album_id: cid,
      program_id: pid
    })
    .then((result) => {
      this.trigger('getProgramComments', result);
    });
  },

  onGetProgramAlbum: function(cid) {
    QtRequest.get('wapi.program_list', {
      channel_id: cid
    })
    .then((result) => {
      this.trigger('getProgramAlbum', result);
    });
  },

  onToggleSelect: function(id) {
    let prev = !!selected[id];
    selected[id] = !prev;
    this.trigger("toggleSelect", selected);
  },

  onGetProgramCommentsByPage: async function(page) {
    let data = await DAO.commentByPage(page);
    this.trigger('getProgramCommentsByPage', data);
  },

  onSearchByPage: async function(keyword, type, page) {
    let data = await DAO.search(keyword, type, page);
    this.trigger('searchByPage', data);
  },

  onGetProgramByPage: async function(page) {
    programCache.page = page;
    let data = await DAO.programByPage(page);
    this.trigger('getProgramByPage', data);
  },

  onSearchAutoComplete: async function(keyword, type) {
    let data = await DAO.searchAutoComplete(keyword);
    this.trigger('searchAutoComplete', {
      type: type || 'default',
      keyword: keyword,
      data: data
    });
  },

  onCloseOmnibox: function() {
    this.trigger('closeOmnibox');
  },

  onCloseAutoComplete: function() {
    this.trigger('closeAutoComplete');
  },

  onUpdateRecoms: async function(cid) {
    let data = await DAO.updateRecoms(cid);
    this.trigger('updateRecoms', data);
  },

  onPlayProgram: function(cid, page, pid) {
    let _page = page || programCache.page;
    window.player.play(cid, _page ? Math.ceil(_page / 3) : null, pid);

    let playing = window.player.getPlaying();
    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    if ( playing && playing.channel_id !== cid) {
      // fix play another album, should bind stopPropagation again.
      addEventListener(document.querySelector('.audio-player .history'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .playlist-collection'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .player-wrapper'), 'click', stop);
    }

    
    this.trigger('ShowPlayDialog', {
      cid: cid,
      pid: pid
    });
    
  },

  onSyncProgram: function(pid) {
    this.trigger('syncProgram', {
      pid: pid
    });
  },

  onPlayAlbum: function(cid, pid) {
    
    let playing = window.player.getPlaying();

    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.player.play(cid, 1, pid);

    if ( playing && playing.channel_id !== cid) {
      // fix play another album, should bind stopPropagation again.
      addEventListener(document.querySelector('.audio-player .history'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .playlist-collection'), 'click', stop);
      addEventListener(document.querySelector('.audio-player .player-wrapper'), 'click', stop);
    }

    this.trigger('ShowPlayDialog', {
      cid: cid,
      pid: pid
    });

    this.trigger('playProgram', {
      cid: cid,
      pid: pid
    });
    
  },

  onPauseProgram: function(cid, page, pid) {
    window.player.pause();
    this.trigger('pauseProgram', pid);
  },

  onPauseAlbum: function(cid) {
    let playing = window.player.getPlaying();
    if (!playing) {
      window.player.pause();
    }

    if (playing.channel_id === cid) {
      window.player.pause();
    }
    this.trigger('pauseProgram', {
      cid: cid
    });
  },


  onMobileProgram: function(cid, pid) {
    this.trigger('mobileProgram', {
      cid: cid,
      pid: pid
    });
  },

  onMobileAlbum: function(cid) {
    this.trigger('mobileAlbum', {
      cid:cid
    });
  },

  onShareProgram: function(cid, pid) {
    this.trigger('shareProgram', {
      cid: cid,
      pid: pid
    });
  },

  onShareAlbum: function(cid) {
    this.trigger('shareAlbum', {
      cid:cid
    });
  },

  onDownloadProgram: function(cid, pid) {
    this.trigger('downloadProgram', {
      cid: cid,
      pid: pid
    });
  },

  onDownloadAlbum: function(cid) {
    this.trigger('downloadAlbum', {
      cid:cid
    });
  },

  onChargeModal: function(cid, pid) {
    this.trigger('chargeModal', {
      cid,
      pid
    })
  },

  onClosePlaylist: function() {
    if (window.player) {
      window.player.hidePlaylist();
      window.player.hideHistory();
    }
  },

  onPublish: function(name, ...args) {
    console.log(`qt bridge publish ${name}`, args);
    if (qtBridgeMap[name]) {
      qtBridgeMap[name](...args);
    } else {
      console.log(`qt bridge publish name not found: ${name}`, args);
    }
    if (name === 'play') {
      this.trigger('playProgram', {
        cid: args[0],
        pid: args[1]
      });
    }
    if (name === 'pause') {
      this.trigger('pauseProgram', {
        cid: args[0],
        pid: args[1]
      });
    }
    if (name === 'mobile') {
      this.trigger('mobileProgram', {
        cid: args[0],
        pid: args[1]
      })
    }
    if (name === 'share') {
      // if (window.player) {
      //   window.player.hidePlaylist();
      //   window.player.hideHistory();
      // }
      this.trigger('shareProgram', {
        cid: args[0],
        pid: args[1]
      })
    }
    if (name === 'download') {
      // if (window.player) {
      //   window.player.hidePlaylist();
      //   window.player.hideHistory();
      // }
      this.trigger('downloadProgram', {
        cid: args[0],
        pid: args[1]
      })
    }
    if (name === 'syncHistory') {
      this.trigger('syncHistory')
    }
    this.trigger(`publish:${name}`, ...args);
  },

  onClearSearchHistory() {
    DAO.clearSearchHistory();
    this.trigger('clearSearchHistory');
  },

  onRemoveSearchHistory(index) {
    DAO.removeSearchHistory(index);
    this.trigger('removeSearchHistory');
  },
  onUpdateUserFav: async function(qtId) {
    if (global.process) {
      this.trigger('updateUserFav', []);
    } else {
      let fav = await DAO.favChannels(qtId);
      console.log('fav data from stores: ', fav);
      this.trigger('updateUserFav', fav);
    }
  },
  onUpdateShoplist: async function(qtId) {
    function transform(obj = {}) {
      return {
        id: obj.id,
        title: obj.title,
        cover: obj.thumbs && obj.thumbs['400_thumb'],
        description: obj.description,
        updatedTime: obj.update_time,
        latestProgram: obj.latest_program
      }
    }
    if (global.process) {
      this.trigger('updateUserFav', []);
    } else {
      let shoplist = await DAO.shoplist(qtId)
        .then(res => {
          let finalData = [];
          for (let cId in res) {
            if (res.hasOwnProperty(cId)) {
              let item = res[cId];
              finalData.push(transform(item))
            }
          }
          return finalData;
        });
      this.trigger('updateShoplist', shoplist);
    }
  },
  onUpdateHistory: async function(qtId) {
    function _mergeHistory(remote, local) {
      let history = [];
      if (remote && remote.length > 0) {
        history = compact(remote.map(item => {
          if (item.ctype === 0 || item.ctype === 1) {
            let position = parseInt(item.position || 0, 10);
            let transferred = {
              ...item,
              position
            };
            if (item.duration) {
              transferred.playTo = (Math.floor(position / item.duration * 100) || 0) + '%';
            }
            return transferred;
          }
          return null;
        }));
      }
      if (local && local.length) {
        local = local.map(item => {
          let transferred = {
            cid: item.channel_id,
            cname: item.channel_name,
            cavatar: item.cavatar,
            playtime: item.timestamp,
            ctype: (item.type === 'program_ondemand') ? 1 : 0
          };
          if (item.programs && item.programs[0]) {
            let program = item.programs[0];
            transferred.pid = program.program_id;
            transferred.pname = program.program_name;
            transferred.position = Math.floor(program.time);
            transferred.playTo = program.progress;
          }
          return transferred;
        });
        // Unique and  Sort history data by played time
        history = uniqBy(orderBy([ ...history, ...local ], (item) => item && item.playtime, ['desc']), item => item.cid);
      }
      return history.slice(0, 50);
    }
    if (global.process) {
      this.trigger('updateHistory', []);
    } else {
      let local = remove(getItem('history') || [], (item) => (item.type === 'program_ondemand' || item.type === 'program_live'));
      return DAO.playHistory(qtId)
        .then(remote => {
          return DAO.albumsIntro(local.map(item => item.channel_id))
            .then(localInfo => {
              let localIntro = {};
              if (localInfo && (localInfo.length > 0)) {
                for(let i = 0; i < localInfo.length; i++) {
                  let item = localInfo[i];
                  item && (localIntro[item.cid] = item);
                }
              }
              for(let i = 0; i < local.length; i++) {
                let item = local[i];
                let remoteInfo = localIntro[item.channel_id];
                if (remoteInfo) {
                  item.catid = remoteInfo.category_id;
                  item.cavatar = remoteInfo.cover;
                  item.ctype = (remoteInfo.type === "channel_ondemand") ? 1 : 0;
                } else {
                  // Get info error, then remove this item
                  local.splice(i, 1)
                }
              }
              // Merge with local history
              this.trigger('updateHistory', _mergeHistory(remote, local));
            })
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  onGetUserInfo: async function(qtId) {
    let isLogged = (typeof qtId === 'string');
    if (global.process) {
      this.trigger('getUserInfo', {});
      return;
    }
    return DAO.userInfo(qtId)
      .then(user => {
        this.trigger('getUserInfo', {
          isLogged,
          avatar: user.avatar,
          name: user.username
        })
      })
  },
  onRefreshToken: async function(data) {
    return DAO.refreshToken(data)
      .then(resp => {
        this.trigger('refreshToken', resp);
      })
  }
});

export default Store;