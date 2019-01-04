/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  /*
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
  */
}

const isStaging = ((typeof window !== 'undefined') && (window.location.host.indexOf('staging') > -1))

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret:
        process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID ||
        '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret:
        process.env.TWITTER_CONSUMER_SECRET ||
        'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
    },
  },
  constant: {
    ProgramListPageSize: 10,
    AlbumProgramPageSize: 10,
    SearchPageSize: 12,
    ProgramCurrentPageSize: 10,
    RecomPageSize: 10,
    domain: isStaging ? 'http://i.staging.qingting.fm/' : 'http://i.qingting.fm/',
    host_ip: '//ip.qingting.fm/',
    // domain: 'http://10.117.220.123',
    host: isStaging ? 'http://i.staging.qingting.fm/wapi/' : 'http://i.qingting.fm/wapi/',
    // host: 'http://10.117.220.123/wapi/',
    host_v6: 'http://api2.qingting.fm/v6/media/',
    host_wsq: 'http://qtime.qingting.fm/api/v1/wsq/',
    host_meta: 'http://10.28.147.226/', // Intranet ip address, only accessable from intranet network
    host_rapi: 'http://rapi.qingting.fm/',
    host_capi: isStaging ? 'http://i.staging.qingting.fm/capi/' : 'http://i.qingting.fm/capi/',
    host_dapi: 'http://d.qingting.fm/capi/',
    host_u2: '//u2.qingting.fm/',
    host_u2_stg: '//u2.staging.qingting.fm/',
    host_pay: 'https://pay.qingting.fm/',
    defaultProgramMap: {
        '上海市': 274
    },
    defaultPodcaster: '4e44a2268f9901d970d49f6206f20f7a',
    gotoThreshold: 10,
    defaultRecCategories: [521, 3251, 523, 531, 1585, 529]
  }
};
