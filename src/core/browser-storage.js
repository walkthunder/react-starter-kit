let localStorageValid = false;
if ((typeof window !== 'undefined') && window.localStorage !== undefined) {
  let key = 'test';
  try {
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    localStorageValid = true;
  } catch (error) {
    localStorageValid = false;
    console.warn('local storage is not available');
  }
}

/**
 * Get data from localStorage
 * @param {string} key
 * @returns {*}
 */
export function getItem(key) {
  if (!localStorageValid) {
    return;
  }
  try {
    let data = JSON.parse(localStorage.getItem(key));
    if (data.expire) {
      const now = Math.floor((new Date().getTime() / 1000));
      return (now < data.expire) ? data.value : null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Set data item into localStorage
 * @param {string} key
 * @param {*} value
 * @param {number} [expire] - value of expire data in second
 *                          - note that it's optional, if not set, the value would be valid forever
 * @returns {*}
 */
export function setItem(key, value, expire) {
  if (!localStorageValid) {
    return;
  }
  if (typeof expire === 'number') {
    if (typeof value === 'string') {
      value = {
        value,
        expire
      }
    } else {
      value.expire = expire
    }
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return null;
  }
}

export function removeItem(key) {
  if (!localStorageValid) {
    return;
  }
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return null;
  }
}