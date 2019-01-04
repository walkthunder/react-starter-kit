import actions from '../flux/actions';
import store from '../flux/stores';
// import request from '../core/fetch';
// import '../core/fetch';

import request, {legacyiesupport} from '../core/fetch/fetch.client';
import fetch from '../core/fetch/fetch.server';

import mock from '../core/mock-fetch';
import { logger } from '../core/qt-core';
import { isBrowser, constant, DEFAULT_CATEGORY_CONFIG } from '../config';
import LRU from 'lru-cache';

const cache_opt_gen = (spec={}) => {
  return { ...{
    max: 5000,
    length: function(n, key) {
      return 1;
    },
    dispose: function(key, n) {
      logger('api disposed', key)
    },
    maxAge: 1000 * 60 * 60
  }, ...spec };
}

const categories_data_v2_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const categories_rec_attr_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const radio_replay_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const radio_playing_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const radio_categories_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const radio_channel_by_region_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const all_regions_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const radio_banner_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const program_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const front_rec_page_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const all_categories_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60 * 24 * 7
};

const category_attrs_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
}

const category_contents_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
}

const front_banner_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};



const channel_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const program_list_opt = {
  max: 5000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const radio_program_list_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const search_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const hotkeyword_opt = {
  max: 5,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60
};
const comment_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const recom_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const channel_metainfo_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const album_metainfo_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const radio_metainfo_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const program_cur_page_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};
const meta_channel_data_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const meta_category_data_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

const meta_program_data_opt = {
  max: 1000,
  length: function(n, key) {
    return 1;
  },
  dispose: function(key, n) {
    logger('api disposed', key)
  },
  maxAge: 1000 * 60 * 60
};

// const dataEnsureMap = {
//   'wapi.program_info': LRU(program_opt),
//   'wapi.channel_info': LRU(channel_opt),
//   'wapi.search_keyword': LRU(search_opt),
//   'wapi.hot_keyword': LRU(hotkeyword_opt),
//   'wsq.program_comments': LRU(comment_opt),
//   'wapi.channel_metaInfo': LRU(channel_metainfo_opt),
//   'wapi.album_metaInfo': LRU(album_metainfo_opt),
//   'wapi.radio_metaInfo': LRU(radio_metainfo_opt),
// }

const cacheMap = {
  'capi.front_categories_v2': LRU(cache_opt_gen()),
  'capi.categories_data_v2': LRU(categories_data_v2_opt),
  'wapi.categories_rec_attr': LRU(categories_rec_attr_opt),
  'rapi.radio_replay': LRU(radio_replay_opt),
  'rapi.radio_playing': LRU(radio_playing_opt),
  'rapi.radio_categories': LRU(radio_categories_opt),
  'rapi.radio_channel_by_region': LRU(radio_channel_by_region_opt),
  'rapi.all_regions': LRU(all_regions_opt),
  'rapi.radio_banner': LRU(radio_banner_opt),
  'wapi.category_contents': LRU(category_contents_opt),
  'wapi.category_attrs': LRU(category_attrs_opt),
  'wapi.all_categories': LRU(all_categories_opt),
  'wapi.program_list': LRU(program_list_opt),
  'wapi.radio_program_list': LRU(radio_program_list_opt),
  'wapi.program_info': LRU(program_opt),
  'wapi.channel_info': LRU(channel_opt),
  'wapi.search_keyword': LRU(search_opt),
  'wapi.hot_keyword': LRU(hotkeyword_opt),
  'wapi.album_recom_list': LRU(recom_opt),
  'wapi.channel_metaInfo': LRU(channel_metainfo_opt),
  'wapi.album_metaInfo': LRU(album_metainfo_opt),
  'wapi.radio_metaInfo': LRU(radio_metainfo_opt),
  'wapi.program_cur_page': LRU(program_cur_page_opt),
  'wsq.program_comments': LRU(comment_opt),
  'wapi.front_banner': LRU(front_banner_opt),
  'front_rec_page': LRU(front_rec_page_opt),
  'meta.channel_data': LRU(meta_channel_data_opt),
  'meta.category_data': LRU(meta_category_data_opt),
  'meta.program_data': LRU(meta_program_data_opt),
};

const cachekeyMap = {
  'capi.front_categories_v2': () => {
    return `capi_front_categories_v2`
  },
  'capi.categories_data_v2': (params) => {
    if ((params instanceof Object) && (params.requiredParams instanceof Object)) {
      const { cid, midsStr, page } = params.requiredParams;
      return `capi_categories_data_v2:${cid}_${midsStr}_${page}`
    }
  },
  'wapi.categories_rec_attr': (cids) => {
    return `api_categories_rec_attr_cid:${cids}`;
  },
  'rapi.radio_replay': () => {
    return 'api_radio_replay';
  },
  'rapi.radio_playing': () => {
    return 'api_radio_playing';
  },
  'rapi.radio_categories': () => {
    return 'api_radio_categories';
  },
  'rapi.radio_channel_by_region': (params) => {
    return `api_radio_channel_by_region_cid:${params.cid}_page:${params.pageNo}_pagesize:${params.pageSize}`;
  },
  'rapi.all_regions': () => {
    return 'api_all_regions'
  },
  'rapi.radio_banner': () => {
    return 'api_radio_banner';
  },
  'wapi.category_contents': (params) => {
    return `api_category_contents_cid:${params.cid}_menus:${params.menus}_page:${params.pageNo}`;
  },
  'wapi.all_categories': () => {
    return 'api_all_categories';
  },
  'wapi.category_attrs': () => {
    return 'api_category_attrs';
  },
  'wapi.front_banner': () => {
    return 'api_front_banner';
  },
  'front_rec_page': (params) => {
    return `api_front_rec_page:${params.cids}`;
  },
  'wapi.program_list': (params) => {
    return `api_program_list:${params.cid}`;
  },
  'wapi.radio_program_list': (params) => {
    return `api_radio_program_list:${params.cid}`;
  },
  'wapi.program_info': (params) => {
    return `api_program_cid:${params.channel_id}_pid:${params.program_id}`;
  },
  'wapi.channel_info': (params) => {
    return `api_channel_cid:${params.channel_id}`;
  },
  'wapi.search_keyword': (params) => {
    return `api_search_${params.keyword}`;
  },
  'wapi.hot_keyword': () => {
    return `hot_keyword`;
  },
  'wapi.channel_metaInfo': (params) => {
    return `channel_metainfo_${params.cid}`;
  },
  'wapi.program_metaInfo': (params) => {
    return `program_metainfo_${params.pids}`;
  },
  'wapi.radio_metaInfo': (params) => {
    return `radio_metainfo_${params.rid}`;
  },
  'wapi.album_recom_list': (params) => {
    return `album_recom_${params.cid}`;
  },
  'wapi.program_cur_page': (params) => {
    return `api_program_cur_page_${params.pid}`;
  },
  'wsq.program_comments': (params) => {
    return `program_comments_${params.program_id}_${params.album_id}`;
  },
  'meta.channel_data': (cid) => {
    return `channel_meta_data_${cid}`
  },
  'meta.category_data': (cid) => {
    return `category_meta_data_${cid}`
  },
  'meta.program_data': (pid) => {
    return `program_meta_data_${pid}`
  },
};

let localStorage = {};
let env = localStorage.env || 'STAGING';
let _mock = localStorage.mock;

let debug = env != 'PRODUCTION';

let host_ip = constant.host_ip;
let host = constant.host
let host_v6 = constant.host_v6
let host_wsq = constant.host_wsq;
let host_meta = constant.host_meta;
let host_rapi = constant.host_rapi;
let host_capi = constant.host_capi;
let host_dapi = constant.host_dapi;
let host_u2 = constant.host_u2;
let host_u2_stg = constant.host_u2_stg;
let host_pay = constant.host_pay;
if (env == 'DEVELOPMENT') {
  host_wsq = 'http://localhost:8800/api/wsq/';
}

if (debug && _mock) {
  let fetch = mock;
}

// if (debug && isBrowser) {
//   host = 'http://i.qingting.fm/wapi/';
//   host_wsq = 'http://qtime.qingting.fm/api/v1/wsq/';
// }

// if (debug && !isBrowser) {
//   host = 'http://i.qingting.fm/wapi/';
//   host_wsq = 'http://qtime.qingting.fm/api/v1/wsq/';
// }

const getRequestURL = (path) => {
  if (requestMap[path] == undefined) {
    logger(`qtradio.web:: cache path:${path} not found`);
    return;
  }
  return requestMap[path];
}
/**
 * Check if params could be trusted
 * @param {Object} requiredParams -Collection of params that required
 * @return {Boolean}
 */
const safeChecker = (requiredParams) => {
  if (requiredParams instanceof Object) {
    for (let key in requiredParams) {
      if (requiredParams.hasOwnProperty(key)) {
        const val = requiredParams[key];
        if (!((typeof val !== 'undefined') && (val !== null))) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

let requestMap = {
  'user.refresh_token': () => {
    return `${host_u2}u2/api/v4/auth`
  },
  'user.info': (qtId) => {
    return `${host_u2}u2/api/v4/user/${qtId}`;
  },
  'user.reset_pw': () => {
    return `${host_u2}u2/api/v4/user/reset_password`;
  },
  'user.register': () => {
    return `${host_u2}u2/api/v4/user/register`;
  },
  'user.sms_send': () => {
    return 'https://appcommon.qingting.fm/common/v1/sms/send'
  },
  'user.sms_check': () => {
    return 'https://appcommon.qingting.fm/common/v1/sms/check'
  },
  'user.check_phone': (phone) => {
    return (typeof phone === 'string') ? `${host_u2}u2/api/v4/check_phone_exist?phone_number=${phone}` : undefined;
  },
  'user.history': (qtId) => {
    return (typeof qtId === 'string') ? `${host_u2}u2/api/v4/user/${qtId}/playhistory` : undefined;
  },
  'user.fav': (qtId) => (typeof qtId === 'string') ? `${host_u2}u2/api/v4/user/${qtId}/favchannels` : undefined,
  'user.channel': (cids) => {
    if (!cids) {
      return undefined;
    }
    if (cids.length > 0) {
      return `${host_v6}channelondemands/list/${cids.join('/')}`;
    }
  },
  'user.shoplist': (qtId) => {
    if (typeof qtId === 'string') {
      return `${host_pay}api/v1/subscriptions?user_id=${qtId}`;
    }
  },
  'user.qq_callback': (params) => {
    if (params) {
      const { access_token, expires_in } = params;
      return `${host_u2}u2/api/v4/qq_callback?access_token=${access_token}&expires_in=${expires_in}`;
    }
  },
  'user.weibo_callback': (code) => {
    if (typeof code === 'string') {
      return `${host_u2}u2/api/v4/weibo_callback?code=${code}`;
    }
  },
  'user.wechat_callback': (code) => {
    if (typeof code === 'string') {
      return `${host_u2}u2/api/v4/wechat_callback?code=${code}`;
    }
  },
  'capi.categories_data_v2': (params) => {
    if (params) {
      const { requiredParams, restParams } = params;
      if (safeChecker(requiredParams)) {
        let { cid, midsStr, page } = { ...requiredParams, ...restParams };
        return `${host_capi}neo-channel-filter?category=${cid}&attrs=${midsStr}&curpage=${page || 1}`;
      }
    }
  },
  'wapi.categories_rec_attr': (c) => {
    return `${host}categories/${c.cids}/attrs`;
  },
  'rapi.radio_replay': () => {
    return `${host_rapi}recommendations/0/replay_list?more=true&replay=true`;
  },
  'rapi.radio_playing': () => {
    return `${host_rapi}recommendations/0/channel_list?more=true&replay=false`;
  },
  'rapi.radio_categories': () => {
    return `${host_rapi}categories?type=channel`;
  },
  'rapi.radio_channel_by_region': (params) => {
    return `${host_rapi}categories/${params.cid}/channels?with_total=true&page=${params.pageNo}&pagesize=${params.pageSize}`
  },
  'rapi.all_regions': () => {
    return `${host_rapi}regions`;
  },
  'rapi.radio_banner': () => {
    return `${host_rapi}recommendations/0/banner?more=false&replay=false`;
  },
  'wapi.category_contents': (params) => {
    if (params) {
      params.pageNo = params.pageNo || 1;
      params.pageSize = params.pageSize || DEFAULT_CATEGORY_CONFIG.PAGESIZE;
      // TODO: Backend should change this api. use '-' instead of '_'
      let menusStr = (params.menus || []).join('_');
      return `${host}flip/categories/${params.cid}/channels/attrs/${menusStr}/page/${params.pageNo}/pagesize/${params.pageSize}`;
    } else {
      throw new Error('BadParamsError');
    }

  },
  'wapi.category_attrs': (params) => {
    if (params) {
      return `${host}categories/${params.cid}/attrs`;
    } else {
      throw new Error('BadParamsError');
    }
  },
  'capi.front_categories_v2': () => {
    return `${host_capi}neo-recommend/attrs`
  },
  'wapi.all_categories': () => {
    return `${host}categories`;
  },
  'wapi.front_banner': () => {
    return `${host_capi}neo-recommend/banner`;
  },
  'wapi.program_info': (params) => {
    return `${host}channels/${params.channel_id}/programs/${params.program_id}`;
  },
  'dapi.channel_info': (params) => {
    return `${host_dapi}channel/${params.channel_id}?user_id=${params.user_id}`;
  },
  'wapi.channel_info': (params) => {
    return `${host}channels/${params.channel_id}`;
  },
  'wapi.program_list': (params) => {
    params.page = params.page || 1;
    params.pageSize = params.pageSize || constant.ProgramListPageSize;
    return `${host}channels/${params.cid}/programs/page/${params.page}/pagesize/${params.pageSize}`;
  },
  'wapi.radio_program_list': (params) => {
    let d = new Date();
    let defaultYear = d.toLocaleDateString('en-US', {year: 'numeric'});
    let defaultMonth = d.toLocaleDateString('en-US', {month: '2-digit'});
    let defaultDay = d.toLocaleDateString('en-US', {day: '2-digit'});
    let date = params.date || (defaultYear + defaultMonth + defaultDay);
    return `${host}channels/${params.cid}/programs/date/${date}`;
  },
  'wapi.search_keyword': (params) => {
    let page = params.page || 1;
    let pageSize = params.pageSize || constant.SearchPageSize;
    return `${host}search?k=${params.keyword}&groups=${params.type}&type=newcms&page=${page}&pagesize=${pageSize}&exclude=people_podcaster,program_live,program_temp`;
    // return `http://search.qingting.fm/api/newsearch/findvt?k=${params.keyword}&groups=${params.type}&type=newcms&curpage=${page}&pagesize=${search_page_size}`;
    // search.qingting.fm/api/newsearch/findvt?k=梁宏达&groups=all&type=newcms&curpage=1&pagesize=10
  },
  'wapi.hot_keyword': (params) => {
    return `${host}search/hotkeywords`;
  },
  'wapi.program_metaInfo': (params) => {
    let pids = params.pids;
    return `${host}program_playcount?pids=${pids}`;
  },
  'wapi.channel_metaInfo': (params) => {
    let cids = params.cids;
    return `${host}channel_playcount?cids=${cids}`;
  },
  'wapi.radio_metaInfo': (params) => {
    let rids = params.rids;
    return `${host}radio_playcount?rids=${rids}`;
  },
  'wapi.album_recom_list': (params) => {
    params.pageSize = constant.RecomPageSize;
    params.page = params.page || 1;
    return `${host}flip/channels/${params.cid}/recommends/page/${params.page}/pagesize/${params.pageSize}`;
  },
  'wapi.program_cur_page': (params) => {
    params.pageSize = params.pageSize || constant.ProgramCurrentPageSize;
    return `${host}channels/${params.cid}/programs/${params.pid}/pagesize/${params.pageSize}`;
  },
  'wapi.ip': (params) => {
    return `${host_ip}ip`;
  },
  'wsq.program_comments': (params) => {
    params.page = params.page || 1;
    return host_wsq + `album/${params.album_id}/program/${params.program_id}/comments?page=${params.page}&podcast_id=${params.podcast_id}`;
  },
  'front_rec_page': (params) => {
    return `http://recpage.c.qingting.fm/v2/hotpage/category/${params.cids}`;
  },
  'web.login': () => {
    return `${host_u2}u2/api/v4/user/login`;
  },
  'favchannels': (qingtingId) => {
    return `${host_u2}u2/api/v4/user/${qingtingId}/favchannels`
  },
  'meta.channel_data': (cid) => {
    return `${host_meta}meta-data/channels/${cid}`
  },
  'meta.category_data': (cid) => {
    return `${host_meta}meta-data/categories/${cid}`
  },
  'meta.program_data': (pid) => {
    return `${host_meta}meta-data/programs/${pid}`
  },
};

const validResult = (path, result) => {
  return !result || (result && (result.code !== 1));
};

const getCached = (path, params) => {
  let cache = cacheMap[path];
  if (!cache || !cachekeyMap[path]) return false;
  let key = cachekeyMap[path](params);
  let hasKey = cache.has(key);
  if (!hasKey) return false;

  let str = cache.get(key);
  if (!str) return false;
  return str;
};

const setCache = (path, params, result) => {
  let cache = cacheMap[path];
  if (!cache) return false;
  let key = cachekeyMap[path](params);
  let str = null;
  try {
    str = JSON.stringify(result);
    cache.set(key, str);
  } catch (e) {
    throw new Error('json stringify error', e);
  }
}

const protocolAdapter = (url) => {
  if (!global.process) {
    url = url.replace('http:', '');
  }
  logger(url);
  return url;
}

const QtRequest = {
  async get(path, params) {
    if (global.process) {
      let cached = getCached(path, params);
      let result = null;
      if (cached) {
        try {
          result = JSON.parse(cached);
        } catch (e) {
          throw new Error('json parse error', e)
        } finally {
          // logger(`api cache hit for::${path} \n ${JSON.stringify(params)} \n`, cached.substring(0,20));
          return Promise.resolve(result);
        }
      } else {
          // logger(`api cache miss for::${path} \n ${JSON.stringify(params)}`);
      }
    }
    const urlPattern = getRequestURL(path);
    const url = urlPattern && urlPattern(params);
    // logger(`qtradio.web::API request with path ${path}, params:`, params);
    if (!url) {
      throw new Error('qt-request route not found');
    }
    let url_encoded = encodeURI(protocolAdapter(url));
    if (global.process) {
      return fetch(url_encoded, {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36'
      })
      .then((result) => {
        return ((result instanceof Object) && (typeof result.json === 'function'))? result.json() : {};
      })
      .then((result) => {
        if (validResult(path, result)) {
          setCache(path, params, result);
        }
        if (result && (result.code === 1)) {
          return {};
        }
        return result;
      })
      .catch(err => {
        return {};
      });
    } else {
      return new Promise((resolve, reject) => {
        request.get(url_encoded)
        .use(legacyiesupport)
        .end((error, result) => {
          logger('qt-request get::', result && result.body);
          error ? resolve({}) : resolve(result && result.body);
        });
      })
    }
  },

  async post(path, params, data) {
    let url = getRequestURL(path) && getRequestURL(path)(params);
    if (global.process) {
      return fetch({
        url: url,
        method: 'POST'
      });
    } else {
      return request.post(url)
        .type('form')
        .send(data)
        .use(legacyiesupport)
        .then((result) => {
          logger('qt-request post::', result);
          return result && result.body;
        })
        .catch((err) => {
          logger(err);
        });
    }

  }

};

export default QtRequest;

// Get four recommends sub attributes of the category
// wapi.categories_rec_attr
// http://i.staging.qingting.fm/wapi/categories/521/attrs

// Get replay radio data
// rapi.radio_replay
// http://rapi.qingting.fm/recommendations/0/replay_list?more=true&replay=true

// Get now playing radio
// rapi.radio_playing
// http://rapi.qingting.fm/recommendations/0/channel_list?more=true&replay=false

// Get all radio categories
// radio_categories
// http://rapi.qingting.fm/categories?type=channel

// radio_channel_by_region
// Get radio channels by regions
// http://rapi.qingting.fm/categories/${params.cid}/channels?page=${params.pageNo}&pagesize=${params.pageSize}

// all_regions
// Get regions list
// http://rapi.qingting.fm/regions

// Get radio page banner data
// http://rapi.qingting.fm/recommendations/0/banner?more=false&replay=false

// Get contents of the category
// default menus is empty which means all contents should be returned
// /wapi/categories/545/channels/attrs/448/page/3/pagesize/12

// Get attributes of the category
// /wapi/categories/521/attrs

// Get Banner data (6 items)
// /wapi/guides/featured/common

// Get radio station guides info
// /wapi/guides/5

// Get recommends page for category requested
// path: recpage =>
// http://recpage.c.qingting.fm/v2/hotpage/category/521
// params: {cid: 521}

// Get channel info. (获取一个频道的信息)
// /wapi/channels/<channel_id>
// http://i.staging.qingting.fm/wapi/channels/68818
// {
//   code: 0,
//   data: {
//     update_time: "2015-11-17 11:05:27",
//     program_count: 27,
//     podcasters: [
//       {
//         desc: "",
//         id: 26732,
//         user_id: "07d1d33c4ac54c90f485218b5b2b6c92",
//         fan_num: 5540,
//         name: "主播呵呵",
//         img_url: "http://pic.qingting.fm/2016/0112/2016011210144766.jpg!200"
//       }
//     ],
//     desc: "全宇宙最无节操的内涵电台，你懂的~ 主播微信：zuimeihehe",
//     id: 68818,
//     type: "channel_ondemand",
//     name: "内涵社",
//     img_url: "http://qingting-pic.b0.upaiyun.com/2014/0506/20140506044213523.jpg!200",
//     score: 6
//   }
// }

// 获取一个频道下面一个点播节目的信息
// /wapi/channels/<channel_id>/programs/<program_id>
// http://i.staging.qingting.fm/wapi/channels/68818/programs/1576585
// {
//   code: 0,
//   data: {
//     update_time: "2015-04-25 16:27:24",
//     file_path: "vod/00/00/0000000000000000000024053219_24.m4a",
//     id: 1576585,
//     desc: "",
//     channel_id: "68818",
//     type: "program_ondemand",
//     img_url: "",
//     name: "【内涵电台】赚钱新技能",
//     duration: 518.034
//   }
// }

// 分页获取一个点播频道的节目列表
// /wapi/channels/<channel_id>/programs/page/<page_no>
// http://i.staging.qingting.fm/wapi/channels/68818/programs/page/1
// {
//   code: 0,
//   data: [
//     {
//     update_time: "2015-04-25 16:27:24",
//     file_path: "vod/00/00/0000000000000000000024053219_24.m4a",
//     id: 1576585,
//     desc: "",
//     channel_id: "68818",
//     type: "program_ondemand",
//     img_url: "",
//     name: "【内涵电台】赚钱新技能",
//     duration: 518
//     }
//   ]
// }


// 获取一个主播的信息
// /wapi/podcasters/<member_id or user_id>
// http://i.staging.qingting.fm/wapi/podcasters/26732
// {
//   code: 0,
//   data: {
//     desc: "做全世界最平胸的女流氓~",
//     id: 26732,
//     user_id: "07d1d33c4ac54c90f485218b5b2b6c92",
//     fan_num: 1,
//     name: "主播呵呵",
//     img_url: "http://pic.qingting.fm/2016/0112/2016011210144766.jpg!200"
//   }
// }

// 分页获取一个节目的回复
// qtime.staging.qingting.fm/wsq/album/<album_id>/program/<program_id>/comments?podcaster_id=
// qtime.staging.qingting.fm/wsq/album/68818/program/1576585/comments?podcast_id=07d1d33c4ac54c90f485218b5b2b6c92

// qtime.staging.qingting.fm/wsq/<channel_id>/topics/<topic_id>

// 获取专辑，相关推荐
// v6/media/channelondemands/68818/recommends/curpage/1/pagesize/20

// 搜索
// http://i.staging.qingting.fm/wapi/search?k=yumiao

// 热门关键字
// http://i.staging.qingting.fm/wapi/search/hotkeywords

// https://git2.qingtingfm.com/web/apiwrapper/tree/master
// file:///Users/chenjosh/Downloads/%E8%9C%BB%E8%9C%93%E4%B8%BB%E7%AB%99%E7%AE%80%E5%8C%96%E7%89%880823/%E6%A0%87%E6%B3%A8/%E4%B8%BB%E7%AB%99%E7%AE%80%E5%8C%96%E7%89%88%E8%AE%BE%E8%AE%A1%E6%A0%87%E6%B3%A8html/index.html#artboard3