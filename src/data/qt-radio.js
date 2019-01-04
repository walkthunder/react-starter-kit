import md5 from 'blueimp-md5';
import QtRequest from './qt-request';
import { isBrowser } from '../config';
import Constants from '../flux/constants';
import { dateBefore } from '../core/qt-core';
import storage from './qt-storage';
import { constant } from '../config';
import { DEFAULT_CATEGORY_CONFIG } from '../config';
const allowGroups = ['channel_ondemand', 'channel_live', 'program_ondemand'];

const COMMENT_DEFAULT = {
  total: 0,
  reply: []
};

let recomPage = 1;
let recomTotal = 0;

let channelId = null;
let podcasterId = null;
let programId = null;

let searchCache = null;

const stripProtocol = (url) => {
  if (url && url.replace) {
    return url.replace(/^http(s?):/i, '');
  }
  return url;
}

const _getComment = async(cid, pid, qtId) => {
  function _existPodcaster(channel) {
    return channel && channel.podcasters && channel.podcasters.length > 0;
  }

  let comments = Promise.resolve(COMMENT_DEFAULT);
  let { data: channel } = (typeof qtId === 'string') ?
    await QtRequest.get('dapi.channel_info', { channel_id: cid, user_id: qtId }) :
    await QtRequest.get('wapi.channel_info', { channel_id: cid });
  channel = _refactorFields(channel);
  podcasterId = _existPodcaster(channel) ? channel.podcasters[0]['user_id'] : constant.defaultPodcaster;
  comments = QtRequest.get('wsq.program_comments', {
    podcast_id: podcasterId,
    album_id: cid,
    program_id: pid
  });

  return comments.then((result) => {
    return {
      comments: result,
      channel: channel
    }
  });
}

const _getEndTime = (startTimeStr, duration) => {
  if (startTimeStr && startTimeStr.slice) {
    let hour = startTimeStr.slice(0,2);
    let minute = startTimeStr.slice(3, 5);
    let startTime = new Date();
    startTime.setHours(hour);
    startTime.setMinutes(minute);
    let endTime = new Date(startTime.getTime() + (duration || 3600) * 1000);
    return endTime.toString().slice(16, 21);
  } else {
    return ''
  }
}
const _radioDataAdapter = (dataArray) => {
  if (dataArray) {
    return dataArray.map(data => {
      let startTime, endTime, subtitle;

      if (data && data.nowplaying && data.nowplaying.start_time && data.nowplaying.duration) {
        startTime = data.nowplaying.start_time;
        endTime = _getEndTime(startTime, data.nowplaying.duration);
      }
      subtitle = data.nowplaying ? data.nowplaying.title : '';
      return {
        imgUrl: stripProtocol(data.cover),
        name: data.title,
        startTime,
        endTime,
        desc: subtitle,
        id: data.content_id
      }
    });
  } else {
    return [];
  }
}
const getFrontRadioSectionData = async() => {
  let promise_radio = QtRequest.get('rapi.radio_playing');
  return await promise_radio
  .then((result) => {
    if (result && result.Data) {
      return _radioDataAdapter(result.Data.slice(0, 15));
    } else {
      return [];
    }
  });
}

const _radioBannerDataAdapter = (data) => {
  if (data && data.map) {
    return data.map(item => {
      let res = {
        imgUrl: stripProtocol(item.cover),
        title: item.title,
        channelTitle: item.channel_title,
        category: item.category,
        count: item.audience_count,
        broadcasters: item.broadcasters,
        linkto: `/radios/${item.content_id}`
      }
      if (item.content_type === 'replay') {
        res.linkto = `/channels/${item.content_id}`
      }
      return res;
    })
  } else {
    return [];
  }
}

const getRadioBannerData = async() => {
  let promise_radio_banner = QtRequest.get('rapi.radio_banner');
  return await promise_radio_banner
  .then((result) => {
    if (result && result.Data) {
      return _radioBannerDataAdapter(result.Data);
    } else {
      return [];
    }

  });
}
const _radioChannelsDataAdapter = (data) => {
  if (data && data.items && data.items.map) {
    let result = data.items.map(item => {
      let result = {
        id: item.content_id,
        imgUrl: stripProtocol(item.cover),
        title: item.title,
        playcount: item.audience_count
      };
      if (item.nowplaying) {
        item.nowplaying.title && (result.desc = '正在直播： ' + item.nowplaying.title)
        item.nowplaying.broadcasters && (result.podcaster = item.nowplaying.broadcasters[0])
      }
      return result;
    });
    return { items: result, count: data.total}
  } else {
    return {count: 0};
  }
}

const getRadioChannelsByCategory = async(params) => {
  let {cid, pageNo, pageSize} = params;
  let promise_radio_channel = QtRequest.get('rapi.radio_channel_by_region', { cid, pageNo: pageNo || 1, pageSize: pageSize || 12 });
  return await promise_radio_channel
  .then(result => {
    if (result && result.Data) {
      return _radioChannelsDataAdapter(result.Data)
    } else {
      return [];
    }
  });
}

const getRadioCategories = async() => {
  let promise_radio_categories = QtRequest.get('rapi.radio_categories');
  return await promise_radio_categories
  .then(result => {
    if (result && result.Data) {
      return result.Data;
    } else {
      return [];
    }
  });
}

const _replayRadioAdapter = (data) => {
  if (data && data.map) {
    return data.map(item => {
      let result = {
        imgUrl: stripProtocol(item.cover),
        name: item.title,
        category: item.category,
        playcount: item.audience_count,
        to: `/channels/${item.content_id}`,
        desc2: item.channel_title
      };
      if (item.broadcasters) {
        result.desc = item.broadcasters.join(' ');
      }
      return result;
    });
  }
}

const getReplayRadio = async() => {
  let promise_replay_radio = QtRequest.get('rapi.radio_replay');
  return await promise_replay_radio
  .then(result => {
    if (result && result.Data) {
      return _replayRadioAdapter(result.Data);
    } else {
      return [];
    }
  });
}

const _bannerDataAdapter = (data) => {
  if (data && data.map) {
    return data.map(item => {
      let res = {
        imgUrl: stripProtocol(item.img_url),
        programId: item.program_id,
        title: item.title,
        channelId: item.id,
        linkto: `/channels/${item.id || ''}`
      }
      if (item.type === 'activity') {
        res.linkto = item.page_url;
        res.target = "_blank";
      }
      if (item.type ==='channel_live') {
        res.linkto = `/radios/${item.id}`
      }
      return res;
    });
  }
  throw new Error('BadParamsError');
}

const getFrontBannerData = async() => {
  let promise_banner = QtRequest.get('wapi.front_banner');
  return await promise_banner
  .then((result) => {
    if (result && result.data) {
      return _bannerDataAdapter(result.data);
    }
    return [];
  });
}

const getAllCategoriesWithRecAttrs = async () => {
  let getCategoriesV2 = QtRequest.get('capi.front_categories_v2');
  let front_categories;
  return getCategoriesV2.then((res) => {
    front_categories = res.data;
    if (res && res.data && res.data.reduce) {
      return res.data.reduce((cidsStr, item) => cidsStr.concat(item.id + '_'), '')
    }
    return Promise.reject();
  })
  .then((cidsStr) => QtRequest.get('front_rec_page', { cids: cidsStr }))
  .then(recRes => {
    if (Object.keys(front_categories).length > 0 && recRes && recRes.data) {
      let recContent = recRes.data;
      return front_categories.reduce((res, item) => {
        let catId = item.id;
        item.categoryId = catId;
        let resItem = recContent[catId];
        if (!resItem) {
          return res;
        }
        item.recAttrs = item.attrs;
        item.title = resItem.name;
        if (resItem.recommends) {
          item.data = resItem.recommends.map((recommend) => {
            if (recommend && recommend.type === 'channel_ondemand') {
              return {
                title: recommend.title,
                imgUrl: stripProtocol(recommend.img_url),
                desc: recommend.desc,
                channelId: recommend.id,
                programId: recommend.program_id,
                playCount: recommend.playcount
              };
            }
          }).filter(i => !!i);
        }
        res = res.concat(item);
        return res;
      },[]);
    } else {
      return [];
    }
  })
  .catch(() => {
    console.log('Get front rec categories failed.');
    return [];
  });
}


/*
  {
  "update_time": "2017-01-06 10:36:25",
  "id": 41504,
  "playcount": "39.3亿",
  "link_id": 0,
  "podcasters": [
  {
  "desc": "",
  "id": 46211,
  "user_id": "7f6ecb2a49e2dc1cbeb1c950cd27b3cb",
  "fan_num": 10383,
  "name": "热点君",
  "img_url": "http://pic.qingting.fm/2016/1018/20161018110246964.png!200"
  }
  ],
  "desc": "每时每刻滚动更新，轻松纵览天下头条！",
  "program_count": 52609,
  "category_id": 545,
  "sale_type": 0,
  "type": "channel_ondemand",
  "name": "滚动头条",
  "img_url": "http://pic.qingting.fm/2016/0518/20160518141916204.jpg!200",
  "score": 9
  }
*/
const _categoryContentsAdapter = (channels) => {
  if (channels && channels.map) {
    return channels.map(item => {
      let result = {
        id: item.id,
        playcount: item.playcount,
        podcasters: item.podcasters,
        desc: item.description,
        categoryId: item.category_id,
        type: item.type || 'channel_ondemand',
        title: item.title,
        imgUrl: stripProtocol(item.cover)
      }
      if (item.score && item.score !== '-1') {
        result.score = item.score;
      }
      if (item.parent_name) {
        result.parent_name = item.parent_name;
      }
      if (item.keywords) {
        result.keywords = item.keywords;
      }
      return result;
    });
  } else {
    return []
  }
}

const getCategoriesPageDateV2 = async(params) => {
  const cid = params && params.requiredParams && params.requiredParams.cid
  let seoMetaPromise = Promise.resolve({})
  if (typeof window === 'undefined' && cid) {
    seoMetaPromise = QtRequest.get('meta.category_data', cid)
  }
  let result = await Promise.all([QtRequest.get('capi.categories_data_v2', params), seoMetaPromise])
  .then(([res, seo]) => {
    if (res && res.data) {
      res.data.seo = seo
    }
    return res;
  })
  .catch( e => {
    return undefined;
  })
  if (result && result.data) {
    result.data.channels = _categoryContentsAdapter(result.data.channels);
    return result;
  }
  return undefined;
}

const getFrontRecPage = async() => {
  let allCategories = await getAllCategoriesWithRecAttrs();
  return allCategories;
}

const getProgramData = async(cid, pid, qtId) => {
  channelId = cid;
  programId = pid;

  let promise_comments = _getComment(cid, pid, qtId);

  let promise_program_page = QtRequest.get('wapi.program_cur_page', {
    cid: cid,
    pid: pid
  });

  let promise_program = QtRequest.get('wapi.program_info', {
    channel_id: cid,
    program_id: pid
  });

  let promise_info = QtRequest.get('wapi.program_metaInfo', {
    pids: `${cid}_${pid}`
  });

  let seo = (typeof window === 'undefined') ? QtRequest.get('meta.program_data', pid) : Promise.resolve({})
  .then(res => {
    return res || {}
  })
  .catch(err => {
    console.error('Error occurred when fetching program seo meta data: ', err);
    return {};
  })

  // let promise_plist = QtRequest.get('wapi.program_list', {
  //   channel_id: cid
  // });

  return await Promise.all([
    promise_comments,
    promise_program,
    promise_info,
    promise_program_page,
    seo
  ]).then((proms) => {
    if (!(proms[0] && proms[1] && proms[1].data && proms[2] && proms[2].data && proms[3] && proms[3].data)) {
      console.log('error result');
      return undefined;
    }
    let { channel, comments } = proms[0];
    let { data: program } = proms[1];
    let { data: info } = proms[2];
    let { data: context } = proms[3];
    let { page: page, index: index, programs: plist} = context;
    let seo = proms[4];
    program.info = info[0];
    plist = plist.map((item) => {
      item.channel_id = cid;
      return item;
    })
    return {
      channel: channel,
      comments: comments,
      program: program,
      plist: plist,
      page: page,
      index: index,
      seo
    }
  })
};

const _getProgramsWithMetaInfo = async(cid, page) => {
  const { data: plist } = await QtRequest.get('wapi.program_list', {
    cid: cid,
    page: page
  });

  // let pids = plist.map((item) => {
  //   return `${cid}_${item.id}`;
  // }).join(',');

  // return QtRequest.get('wapi.program_metaInfo', {
  //   pids: pids
  // }).then((info) => {
  //   let programMetaInfo = {};
  //   info.data.map((item) => {
  //     programMetaInfo[item.id] = item;
  //   });
  //   return {
  //     plist: plist,
  //     metaInfo: programMetaInfo
  //   }
  // });
};
const _refactorFields = (raw = {}) => {
  if (typeof raw.v === 'undefined') { // legacy data
    return raw;
  }
  let fined = {
    id: raw.id,
    update_time: raw.update_time,
    playcount: raw.playcount,
    desc: raw.description,
    program_count: raw.program_count,
    category_id: raw.category_id,
    name: raw.title,
    img_url: raw.thumbs['200_thumb'],
    score: raw.score,
    type: 'channel_ondemand'
  };
  fined.podcasters = (raw.podcasters || []).map(pod => ({name: pod.nick_name, img_url: pod.avatar, user_id: raw.qingting_id}));
  fined.isCharged = ((raw.purchase || {}).item_type === 0) ? false : true
  let userRelevance = raw.user_relevance || {};
  fined.paid = userRelevance.sale_status;
  fined.paidPIds = userRelevance.paid_program_ids;
  return fined;
}
const getChannelData = async(cid, page, qtId) => {
  let promise_album = (typeof qtId === 'string') ?
    QtRequest.get('dapi.channel_info', { channel_id: cid, user_id: qtId }) :
    QtRequest.get('wapi.channel_info', { channel_id: cid });

  let promise_plist = QtRequest.get('wapi.program_list', {
    cid: cid,
    page: page
  });

  let promise_reclist = QtRequest.get('wapi.album_recom_list', {
    cid: cid
  });

  let seo_meta = ((typeof window === 'undefined') ? QtRequest.get('meta.channel_data', cid) : Promise.resolve({}))
  .then(res => res || {})
  .catch(err => {
    console.error('error: ', err);
    return {}
  })

  return await Promise.all([
    promise_album,
    promise_plist,
    promise_reclist,
    seo_meta
  ]).then((proms) => {
    if (proms[0] && proms[1] && proms[2]) {
      let { data: album } = proms[0];
      let { data: plist } = proms[1];
      let { data: reclist} = proms[2];
      let seo = proms[3];
    // Update global status
    recomTotal = reclist.total;
    channelId = cid;
      // Reset object fields
      album = _refactorFields(album)
      return {
        album: album,
        plist: plist,
        reclist: reclist,
        seo
      }
    }
    return {};
  });
};

const _getRadioPrograms = async(cid) => {
  let today = QtRequest.get('wapi.radio_program_list', {
    cid: cid,
    date: dateBefore(0)
  });

  let yesterday = QtRequest.get('wapi.radio_program_list', {
    cid: cid,
    date: dateBefore(1)
  });

  let tomorrow = QtRequest.get('wapi.radio_program_list', {
    cid: cid,
    date: dateBefore(-1)
  });
  return Promise.all([yesterday, today, tomorrow]).then((days) => {
    return days.map((day) => {
      return day['data'];
    })
  })
};

const getRadioData = async(cid) => {
  if (isNaN(parseInt(cid, 10))) {
    return Promise.resolve()
  }
  let promise_album = QtRequest.get('wapi.channel_info', {
    channel_id: cid
  });

  let promise_plist = _getRadioPrograms(cid);

  let promise_reclist = QtRequest.get('wapi.album_recom_list', {
    cid: cid
  });

  return Promise.all([
    promise_album,
    promise_plist,
    promise_reclist
  ]).then((proms) => {
    if (proms[0] && proms[1] && proms[2]) {
      let { data: album } = proms[0];
      let plist = proms[1];
      let { data: reclist } = proms[2];
      recomTotal = reclist && reclist.total || 0;
      channelId = cid;

      return {
        album: album,
        plist: plist,
        reclist: reclist
      }
    }
    return {};
  });
};

const updateRecoms = async(cid) => {
  recomPage += 1;

  if (channelId !== cid) recomPage = 1;

  if (recomPage > Math.ceil(recomTotal / constant.RecomPageSize)) {
    recomPage = 1;
  }
  let { data: reclist } = await QtRequest.get('wapi.album_recom_list', {
    cid: cid,
    page: recomPage
  });

  let cids = reclist.channels.map((item) => {
    return item.id;
  })
  .join(',');

  let {data: channelMetaInfo} = await QtRequest.get('wapi.channel_metaInfo', {
    cids: cids
  });

  let channel = {};
  channelMetaInfo.map((item) => {
    channel[item.id] = item;
  });

  reclist.channels = reclist.channels.map((item) => {
    item.metaInfo = channel[item.id];
    return item;
  });

  return reclist;
}

const getCommentByPage = async(page) => {
    const data = QtRequest.get('wsq.program_comments', {
      podcast_id: podcasterId,
      album_id: channelId,
      program_id: programId,
      page: page
    })
    return data;
}

const getProgramByPage = async(page) => {
  const {data: plist} = await QtRequest.get('wapi.program_list', {
    cid: channelId,
    page: page
  });

  let pids = plist.map((item) => {
    return `${channelId}_${item.id}`;
  })
  .join(',');

  const {data: info} = await QtRequest.get('wapi.program_metaInfo', {
    pids: pids
  });

  let programMetaInfo = {};
  info.map((item) => {
    programMetaInfo[item.id] = item;
  });

  return {
    programs: plist,
    metaInfo: programMetaInfo
  };
};

const _radioPlayingDataAdapter = (data) => {
  if (data && data.map) {
    return data.map(item => {
      let result = {
        imgUrl: stripProtocol(item.cover),
        name: item.title,
        channelTitle: item.channel_title,
        category: item.category,
        nowplaying: item.nowplaying,
        playcount: item.audience_count,
        to: `/radios/${item.content_id}`,
      }
      if (item.nowplaying) {
        let startTime = item.nowplaying.start_time;
        let endTime = _getEndTime(item.nowplaying.start_time, item.nowplaying.duration);
        result.desc = item.nowplaying.title;
        result.startTime = item.nowplaying.start_time;
        result.endTime = endTime;
        result.desc2 = `${startTime}-${endTime}`;
      }
      return result;
    });
  } else {
    return [];
  }
}
const getRadioPlaying = async() => {
  const result = await QtRequest.get('rapi.radio_playing');
  if (result && result.Data) {
    return _radioPlayingDataAdapter(result.Data);
  } else {
    return [];
  }
}

const getHotKeywords = async() => {
  const {data: hotKeywords} = await QtRequest.get('wapi.hot_keyword');
  return hotKeywords['data'];
};

const _getSearchData = async(keyword, type, page, pageSize = 15) => {
  if (type === 'all') type = 'real_remix';
  let hasResult = (results) => {
    return results['data'] && results['data'].length > 0;
  };

  const {data: results} = await QtRequest.get('wapi.search_keyword', {
    pageSize,
    keyword: keyword,
    type: type,
    page: page
  });
  if (type === 'real_remix') {
    return results['data'];
  } else {
    if (hasResult(results)) {
      return results['data'][0]['doclist'];
    } else {
      return {
        docs: []
      };
    }
  }
};

const getSearchData = async(keyword, type, page) => {
  const _getSearchWithMetaInfo = async(keyword, type, page) => {
    let result = await _getSearchData(keyword, type, page);
    return getMetaInfo(result).then((metaInfo) => {
      return {
        results: result,
        metaInfo: metaInfo
      }
    });
  };

  let promise_search = _getSearchWithMetaInfo(keyword, type, page);
  let promise_hotkeyword = getHotKeywords();
  return Promise.all([
    promise_search,
    promise_hotkeyword
  ]).then((proms) => {
    return {
      results: proms[0]['results'],
      metaInfo: proms[0]['metaInfo'],
      hotKeywords: proms[1]
    }
  })
};

const getSearchAutoComplete = async(keyword) => {
  if (!keyword) return [];
  let data = await _getSearchData(keyword, 'all');
  return data.docs.map((item) => item.title);
};

const getMetaInfo = async(results) => {
  let pids = results.docs.filter((item) => {
    return item.type === 'program_ondemand';
  })
  .map((item) => {
    return `${item.parent_id}_${item.id}`;
  })
  .join(',')

  let cids = results.docs.filter((item) => {
    return item.type === 'channel_ondemand'
  })
  .map((item) => {
    return item.id;
  })
  .join(',')

  let rids = results.docs.filter((item) => {
    return item.type === 'channel_live'
  })
  .map((item) => {
    return item.id;
  })
  .join(',')

  let promise_program = QtRequest.get('wapi.program_metaInfo', {
    pids: pids
  });
  let promise_channel = QtRequest.get('wapi.channel_metaInfo', {
    cids: cids
  });
  let promise_radio = QtRequest.get('wapi.radio_metaInfo', {
    rids: rids
  });

  return Promise.all([
    promise_program,
    promise_channel,
    promise_radio
  ]).then((proms) => {
    let { data: programMetaInfo } = proms[0];
    let { data: channelMetaInfo } = proms[1];
    let { data: radioMetaInfo } = proms[2];

    let program = {};
    programMetaInfo.map((item) => {
      if (item['score']) {
        item['score'] = parseInt(item['score']);
      }
      program[item.id] = item;
    });

    let channel = {};
    channelMetaInfo.map((item) => {
      channel[item.id] = item;
    });

    let live = {};
    radioMetaInfo.map((item) => {
      live[item.id] = item;
    });

    return {
      channel_ondemand: channel,
      program_ondemand: program,
      channel_live: live
    };
  });
};

const getRegions = async () => {
  let {Data: regions} = await QtRequest.get('rapi.all_regions');
  return regions;
}

const getGeoLocation = async () => {
  let { data: geo } = await QtRequest.get('wapi.ip');
  return geo;
}

const login = async (params) => {
  let res = await QtRequest.post('web.login', null, params);
  return res;
}

const getUserFav = async (qtId) => {
  if ( typeof qtId === 'string') {
    let res = await QtRequest.get('favchannels', qtId);
    if (res && res.data) {
      return res.data;
    }
  }
  return undefined;
}

const getUserInfoWithQQToken = async (params) => {
  let res = await QtRequest.get('user.qq_callback', params);
  return res;
}
const getUserInfoWithWeiboToken = async (code) => {
  let res = await QtRequest.get('user.weibo_callback', code);
  return res;
}
const getUserInfoWithWechatToken = async (code) => {
  return await QtRequest.get('user.wechat_callback', code)
}

const refreshToken =  async (data) => {
  return await QtRequest.post('user.refresh_token', null, data)
}

const getShoplist = async (qtId) => {
  let data = await QtRequest.get('user.shoplist', qtId)
    .then(res => {
      let cids = (res && res.data || []).map(item => item.entity_id);
      return QtRequest.get('user.channel', cids)
        .then((resData) => resData && resData.data)
    })
    .catch(err => {
      // console.info('[getShoplist] - ', err)
      return {}
    });
  return data;
}

const getFavChannels = async (qtId) => {
  if (typeof qtId === 'string') {
    let data = await QtRequest.get('user.fav', qtId)
      .then(res => {
        let infoPromises = (res && res.data || []).map(item => 
          (item && item.id) ?
          QtRequest.get('wapi.channel_info', { channel_id: item.id }) :
          Promise.resolve({}));
        return Promise.all(infoPromises)
          .then(resData => resData.map(c => c && c.data || {}))
      })
      .catch(err => {
        console.error('[getFavChannels] - ', err);
        return [];
      })
    return data;
  }
  return Promise.resolve([]);
}

const getPlayHistory = async(qtId) => {
  if (typeof qtId === 'string') {
    let data = await QtRequest.get('user.history', qtId)
      .then(res => {
        if (res && (typeof res.data === 'string')) {
          return JSON.parse(res.data);
        }
        return [];
      })
      .catch(err => {
        return [];
      });
    return data;
  }
  return Promise.resolve([]);
}

const getAlbumsIntro = (cids) => {
  if (cids && cids.length > 0) {
    let dataPromises = cids.map(cid => {
      if (typeof cid !== 'undefined') {
        return QtRequest.get('wapi.channel_info', { channel_id: cid })
          .then(res => (res && res.data))
          .catch(err => null)
      }
    });
    return Promise.all(dataPromises)
      .then(data => data.map(item => (item && { cid: item.id, cover: item.img_url || '//sss.qingting.fm/neo/default_album.png', type: item.type })))
      .catch(err => Promise.resolve([]))
  }
  return Promise.resolve([])
}

const _dateToFormat = (date) => {
  let result = '';
  let year = date.getFullYear();
  result += year + '-';
  let month = date.getMonth() + 1;
  if (month < 10) {
    result += '0' + month;
  } else {
    result += month;
  }
  result = result + '-'
  let day = date.getDate();
  if (day < 10) {
    result += '0' + day;
  } else {
    result += day;
  }
  return result;
}

const getPhoneAuthCode = (phone, isExist = false) => {

  let today = _dateToFormat(new Date());
  let salted = md5(`${today}_nxqt009`);

  if (typeof phone === 'string') {
    return QtRequest.get('user.check_phone', phone)
      .then(res => {
        if (res && res.data) {
          if (!!res.data.exists !== !!isExist) {
            return {
              succeed: false,
              message: '该手机号已注册，请直接登录'
            }
          }
          // request auth
          let data = {
            mobile: phone,
            device_id: 'qt_web_a_account',
            access_id: salted,
            app_type: '0001'
          };
          return QtRequest.post('user.sms_send', null, data)
            .then(res => {
              if (res && res.data === 'success') {
                return { succeed: true }
              }
              return {
                succeed: false,
                message: res && res.errormsg
              }
            })
        }
        return {
          succeed: false,
          message: ((res || {}).data || {}).msg
        }
      })
      .catch(err => {
        console.error(err);
        return {
          succeed: false,
          message: '网络请求失败'
        };
      })
  }
}

const doRegister = (userData) => {
  let today = _dateToFormat(new Date());
  let salted = md5(`${today}_nxqt009`);
  let smsCheckData = {
    mobile: userData.phone,
    device_id: 'qt_web_www_account',
    access_id: salted,
    code: userData.auth
  };
  return QtRequest.post('user.sms_check', null, smsCheckData)
    .then(res => {
      if (res && (res.data === 'success')) {
        let userInfo = {
          device_id: userData.device_id,
          password: userData.password,
          platform: userData.platform,
          register_id: userData.phone,
          register_type: userData.register_type,
          verify_code: userData.auth
        }
        return QtRequest.post('user.register', null, userInfo)
          .then(regRes => {
            if (regRes && regRes.data) {
              return { succeed: true };
            } else {
              return {
                succeed: false,
                message: regRes ? regRes.errormsg : ''
              }
            }

          });
      } else {
        return {
          succeed: false,
          message: '手机验证码错误'
        }
      }
    })
    .catch(err => {
      console.error(err);
      return {
        succeed: false,
        message: '网络请求失败'
      }
    })
};

const doResetPassword = (userData) => {
  let today = _dateToFormat(new Date());
  let salted = md5(`${today}_nxqt009`);
  let smsCheckData = {
    mobile: userData.user_id,
    device_id: 'qt_web_www_account',
    access_id: salted,
    code: userData.verify_code
  };
  return QtRequest.post('user.sms_check', null, smsCheckData)
    .then(res => {
      if (res && (res.data === 'success')) {
        return QtRequest.post('user.reset_pw', null, userData)
          .then(resp => {
            if (resp) {
              return true;
            }
            // TODO: Add error messages
          })
      }
    })
};

const getUserInfo = (qtId) => {
  return QtRequest.get('user.info', qtId)
    .then(res => {
      console.log(res);
      if (res && res.data) {
        return res.data;
      }
      return {};
    })
};

const DAO = {
  refreshToken,
  userInfo: getUserInfo,
  resetPassword: doResetPassword,
  register: doRegister,
  phoneAuthCode: getPhoneAuthCode,
  userFav: getUserFav,
  login: login,
  categoriesPageDateV2: getCategoriesPageDateV2,
  frontBannerData: getFrontBannerData,
  frontRecPage: getFrontRecPage,
  frontRadioSectionData: getFrontRadioSectionData,
  program: getProgramData,
  programByPage: getProgramByPage,
  commentByPage: getCommentByPage,
  channel: getChannelData,
  radio: getRadioData,
  hotKeywords: getHotKeywords,

  search: getSearchData,
  searchAutoComplete: getSearchAutoComplete,

  searchHistory: storage.getSearchHistory,
  pushSearchHistory: storage.pushSearchHistory,
  removeSearchHistory: storage.removeSearchHistory,
  clearSearchHistory: storage.clearSearchHistory,

  metaInfo: getMetaInfo,
  updateRecoms: updateRecoms,

  replayRadio: getReplayRadio,
  radioPlaying: getRadioPlaying,
  radioCategories: getRadioCategories,
  radioChannelsByCategory: getRadioChannelsByCategory,
  radioBannerData: getRadioBannerData,
  regions: getRegions,
  geo: getGeoLocation,
  userInfoWithQQToken: getUserInfoWithQQToken,
  userInfoWithWeiboToken: getUserInfoWithWeiboToken,
  userInfoWithWechatToken: getUserInfoWithWechatToken,
  shoplist: getShoplist,
  favChannels: getFavChannels,
  playHistory: getPlayHistory,
  albumsIntro: getAlbumsIntro
};

export default DAO;