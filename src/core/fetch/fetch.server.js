import Promise from 'bluebird';
import fetch, { Request, Headers, Response } from 'node-fetch';
import { host } from '../../config';
import http from 'http';

fetch.Promise = Promise;
Response.Promise = Promise;

const agent = new http.Agent({
  keepAlive: true
});

function localUrl(url) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://${host}${url}`;
}

function localFetch(url, options) {
  options.agent = agent; 
  return fetch(localUrl(url), options);
}

export { localFetch as default, Request, Headers, Response };
