"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sameOrigin = sameOrigin;
exports.parse = exports.stripQuery = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _whatwgUrl = require("devtools/client/shared/vendor/whatwg-url");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const defaultUrl = {
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "null",
  password: "",
  path: "",
  pathname: "",
  port: "",
  protocol: "",
  search: "",
  // This should be a "URLSearchParams" object
  searchParams: {},
  username: ""
};
const stripQuery = (0, _lodash.memoize)(function stripQueryAndHash(url) {
  let queryStart = url.indexOf("?");
  let before = url;
  let after = "";

  if (queryStart >= 0) {
    const hashStart = url.indexOf("#");

    if (hashStart >= 0) {
      if (hashStart < queryStart) {
        queryStart = hashStart;
      }

      after = url.slice(hashStart);
    }

    before = url.slice(0, queryStart);
  }

  return before + after;
});
exports.stripQuery = stripQuery;
const parse = (0, _lodash.memoize)(function parse(url) {
  let urlObj;

  try {
    urlObj = new _whatwgUrl.URL(url);
  } catch (err) {
    urlObj = { ...defaultUrl
    }; // If we're given simply a filename...

    if (url) {
      const hashStart = url.indexOf("#");

      if (hashStart >= 0) {
        urlObj.hash = url.slice(hashStart);
        url = url.slice(0, hashStart);

        if (urlObj.hash === "#") {
          // The standard URL parser does not include the ? unless there are
          // parameters included in the search value.
          urlObj.hash = "";
        }
      }

      const queryStart = url.indexOf("?");

      if (queryStart >= 0) {
        urlObj.search = url.slice(queryStart);
        url = url.slice(0, queryStart);

        if (urlObj.search === "?") {
          // The standard URL parser does not include the ? unless there are
          // parameters included in the search value.
          urlObj.search = "";
        }
      }

      urlObj.pathname = url;
    }
  }

  urlObj.path = urlObj.pathname + urlObj.search;
  return urlObj;
});
exports.parse = parse;

function sameOrigin(firstUrl, secondUrl) {
  return parse(firstUrl).origin == parse(secondUrl).origin;
}