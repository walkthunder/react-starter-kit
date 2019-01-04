function date_to_format(date) {
  var result = "";
  var year = date.getFullYear();
  result += year + '-';
  var month = date.getMonth() + 1;
  if (month < 10) {
    result += "0" + month;
  } else {
    result += month;
  }
  result = result + "-"
  var day = date.getDate();
  if (day < 10) {
    result += "0" + day;
  } else {
    result += day;
  }
  return result;
}

// const env = global.process ? global.process.env : localStorage.getItem('env');
const env = global.process ? 'DEVELOPMENT' : localStorage.getItem('env');

const _logger = (...params) => {
  if (env === 'DEVELOPMENT') {
    console.log(...params);
  }
};

_logger.warn = (...params) => {
  if (env === 'DEVELOPMENT') {
    console.warn(...params);
  }
};

export const logger = _logger;

export function info_fromNow(str) {
  let dateString = str.replace(' ', 'T') + '+08:00';
  let then = new Date(dateString);
  return readable_fromNow(then.getTime());
}

export function readable_fromNow(ts) {
  var now = Date.now();
  var delta = parseInt((now - ts)/1000);
  if (delta < 0) {
    var today = new Date();
    return date_to_format(today);
  } else {
    if (delta < 60) {
      return "" + delta + "秒前";
    } else if (delta < 3600) {
      return "" + Math.floor(delta / 60) + "分钟前";
    } else if (delta < 3600 * 24) {
      return "" + Math.floor(delta / 3600) + "小时前";
    } else {
      var days = Math.floor(delta / (3600 * 24));
      if (days < 8) {
        return "" + days + "天前";
      } else {
        var postdate = new Date(ts);
        return date_to_format(postdate);
      }
    }
  }
}

export function dateBefore(before) {
  let now = Date.now();
  let then = now - before * 3600 * 24 * 1000;
  let d = new Date(then);
  let defaultYear = d.getFullYear();
  let defaultMonth = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  let defaultDay = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  return defaultYear.toString() + defaultMonth.toString() + defaultDay.toString();
}

export function duration (dur) {
  let res = '';
  let hour = Math.floor(dur / 3600);
  let min = Math.floor((dur - hour * 3600) / 60);
  let sec = Math.floor(dur - hour * 3600 - min * 60);

  hour = hour < 10 ? '0' + hour : hour;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  res += hour > 0 ? (hour + ':') : '';
  res += min > 0 ? (min + ':') : '00:';
  res += sec > 0 ? sec : '00';
  return res;
};

function fixThumb200(url) {
  if (url.indexOf('pic.qingting.fm') == -1) {
    return url.replace('!200', '');
  } else {
    return url;
  }
}

function getSafariCompatibleDateString(dateString) {
  return dateString.replace(' ', 'T') + '+08:00';
}

let defaultThumb = '//sss.qingting.fm/neo/default_album.png';
let defaultAvatar = '//sss.qingting.fm/neo/default_avatar.png';

export function safeAlbumThumb (album) {
  return album['img_url'] ? fixThumb200(album['img_url']) : defaultThumb;
}

export function safeAvatar (url) {
  if (url.indexOf('http') == 0) {
    return url;
  } else {
    return defaultAvatar;
  }
}

export function biggerThumb (url) {
  return url.replace('!200', '!400');
}

export function getRadioNow (today) {
  if (today && today.filter) {
    return today.filter((program) => {
      return getRadioState(program.start_time, program.end_time) === 0;
    })[0];
  }
  return [];
}

export function getRadioState (start, end) {
  let startStr = getSafariCompatibleDateString(start);
  let endStr = getSafariCompatibleDateString(end);

  let now = Date.now();
  let _start = (new Date(startStr)).getTime();
  let _end = (new Date(endStr)).getTime();
  if (_end < now) {
    return -1;
  } else if (_start > now) {
    return 1;
  } else {
    return 0;
  }
}

export function getRadioDuration (start, end) {
  return start.slice(11, 16) + ' - ' + end.slice(11, 16);
};

export function getProgramTime (time) {
  if (!time) return 0;
  return time.slice(0, 10);
};

export function readableCount (num) {
  let count = parseInt(num);
  if ( !(count >= 0) ) return 0;
  if ( count > 10000 && count < 100000000 ) {
    return (count / 10000).toFixed(1) + '万';
  } else if ( count > 100000000 ) {
    return (count / 100000000).toFixed(1) + '亿';
  } else {
    return count;
  }
}

export function scrollToTop(offset, duration) {
  let _offset = offset || 0;
  let _duration = duration || 100;
  if (typeof jQuery === 'undefined') {
    if ((typeof window !== 'undefined') && window.scroll) {
      window.scroll({top: _offset, behavior: 'smooth'});
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = _offset;
    }
  } else {
    $('body').animate({
      scrollTop: _offset
    }, _duration);
  }
}

export function getShareDownloadURL(cid, pid) {
  if (cid && pid) {
    return encodeURI(`http://m.qingting.fm/vchannels/${cid}/programs/${pid}`);
  }
  if (cid) {
    return encodeURI(`http://m.qingting.fm/vchannels/${cid}`);
  }
  return null;
}

export function trackCNZZ(category, action, label) {
  if (typeof qtWebLog !== 'undefined') {
    // push data
    qtWebLog.push('_trackEvent', action, {
      category,
      label
    })
  }
}

export function isArray(obj) {
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  return Array.isArray(obj);
}

export function loadScript( url, callback ) {
  var script = document.createElement( "script" )
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s); 
}
