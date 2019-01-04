// import 'whatwg-fetch';
// import 'fetch-ie8';
import request from 'superagent';
import legacyIESupport from 'superagent-legacyiesupport';

// export default request;
export default request;
export const legacyiesupport = legacyIESupport;
