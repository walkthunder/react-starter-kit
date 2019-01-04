const SEARCH_HISTORY_LKEY = 'search_history';
const SEARCH_HISTORY_NUM = 10;

function getSearchHistory () {
  if (global.process) return [];
  let history = [];
  let historyStr = localStorage.getItem(SEARCH_HISTORY_LKEY) || '[]';
  try {
    history = JSON.parse(historyStr);
  } catch (e) {
    throw new Error('fail to parse localStorage seach history');
  } finally {
    return history.slice(0, SEARCH_HISTORY_NUM);
  }
};

function pushSearchHistory (keyword) {
  if (global.process) return [];  
  let history = getSearchHistory();
  
  if (!keyword) return history;
  let _keyword = keyword.slice(0, 20);

  let index = history.indexOf(_keyword);
  if (index > -1) {
    history.splice(index, 1);
  }
  history.unshift(_keyword);
  localStorage.setItem(SEARCH_HISTORY_LKEY, JSON.stringify(history.slice(0, SEARCH_HISTORY_NUM)));
  return history;
};

function removeSearchHistory (index) {
  if (global.process) return [];  
  let history = getSearchHistory();
  history.splice(index, 1);
  localStorage.setItem(SEARCH_HISTORY_LKEY, JSON.stringify(history.slice(0, SEARCH_HISTORY_NUM)));  
  return history;
};

function clearSearchHistory() {
  if (global.process) return [];  
  localStorage.setItem(SEARCH_HISTORY_LKEY, '');
};

const storage = {
  getSearchHistory: getSearchHistory,
  pushSearchHistory: pushSearchHistory,
  removeSearchHistory: removeSearchHistory,
  clearSearchHistory: clearSearchHistory
}

export default storage;