// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if (typeof(oauth2) == 'undefined') {
  oauth2 = {};
}

/** OAuth 2 core utilities. */
oauth2.core = oauth2.core || {};

(function() {

  var config = {
    AUTH_STATE: oauth2.core.config.AUTH_STATE,
    AUTH_URL: oauth2.core.config.AUTH_URL,
    CLIENT_ID_PARAM: oauth2.core.config.CLIENT_ID_PARAM,
    HOSTED_DOMAIN_PARAM: oauth2.core.config.HOSTED_DOMAIN_PARAM,
    IMMEDIATE_PARAM: oauth2.core.config.IMMEDIATE_PARAM,
    IMMEDIATE_PARAM_VALUE: oauth2.core.config.IMMEDIATE_PARAM_VALUE,
    ORIGIN: oauth2.core.config.ORIGIN,
    ORIGIN_PARAM: oauth2.core.config.ORIGIN_PARAM,
    POSTMESSAGE_PARAM: oauth2.core.config.POSTMESSAGE_PARAM,
    POSTMESSAGE_PARAM_VALUE: oauth2.core.config.POSTMESSAGE_PARAM_VALUE,
    PROXY_ID: oauth2.core.config.PROXY_ID,
    PROXY_PARAM: oauth2.core.config.PROXY_PARAM,
    RESPONSE_TYPE_ACCESS_TOKEN_PARAM_VALUE:
        oauth2.core.config.RESPONSE_TYPE_ACCESS_TOKEN_PARAM_VALUE,
    RESPONSE_TYPE_PARAM: oauth2.core.config.RESPONSE_TYPE_PARAM,
    SCOPE_PARAM: oauth2.core.config.SCOPE_PARAM,
    SESSION_INDEX_PARAM: oauth2.core.config.SESSION_INDEX_PARAM,
    STATE_PARAM: oauth2.core.config.STATE_PARAM,
    USER_ID_PARAM: oauth2.core.config.USER_ID_PARAM
  };

  var applicationUri = null;
  var clientId = null;
  var scopes = null;
  var oauth2userHint = null;
  var overrideSessionIndex = null;
  var overrideHostedDomain = null;

  /**
   * Configure OAuth 2 client ID.
   * @param {?string} value The client ID. A null will be treated as
   *     an empty string which will then be omitted from an
   *     authorization URL.
   */
  oauth2.core.setClientId = function(value) {
    clientId = String((value == null) ? '' : value);
  };

  /**
   * Configure required authorization scopes.
   * @param {string|Array.<string>|null} value The list of required
   *     scopes; an array will be joined with spaces, and null will
   *     be treated as an empty string which will then be omitted
   *     from an authorization URL.
   */
  oauth2.core.setScopes = function(value) {
    scopes = value;
    if (typeof(scopes) != 'string') {
      if (scopes == null) {
        scopes = '';
      } else if (scopes.length >= 0) {
        scopes = scopes.join(' ');
      }
    }
    scopes = String(scopes);
  };

  /**
   * Returns the current session index for Google's multiple sign-in
   * system.
   * @return {?string} The session index, or null.
   */
  oauth2.core.getSessionIndex = function() {
    if (overrideSessionIndex != null) {
      return overrideSessionIndex;
    }
    if (!applicationUri) {
      applicationUri = shindig.uri(window.location.href);
    }
    return applicationUri.getQP(config.SESSION_INDEX_PARAM);
  };

  /**
   * Sets the session index for Google's multiple sign-in system.
   * @param {?string} sessionIndex The session index, or null to
   *     reset to the default value based on the 'authuser' URL
   *     parameter.
   */
  oauth2.core.setSessionIndex = function(sessionIndex) {
    overrideSessionIndex = sessionIndex;
  };

  /**
   * Returns the Google Apps hosted domain.
   * @return {?string} The domain, or null.
   */
  oauth2.core.getHostedDomain = function() {
    if (overrideHostedDomain != null) {
      return overrideHostedDomain;
    }
    if (!applicationUri) {
      applicationUri = shindig.uri(window.location.href);
    }
    return applicationUri.getQP(config.HOSTED_DOMAIN_PARAM);
  };

  /**
   * Sets the Google Apps hosted domain.
   * @param {?string} hostedDomain The domain, or null to reset to
   *     the default value based on the 'hd' URL parameter.
   */
  oauth2.core.setHostedDomain = function(hostedDomain) {
    overrideHostedDomain = hostedDomain;
  };

  /**
   * Sets the user hint for subsequent immediate-mode authorization
   * flows.
   * @param {?string} userHint The user hint (e.g. an email
   *     address), or null to reset the hint.
   */
  oauth2.core.setUserHint = function(userHint) {
    oauth2userHint = userHint;
  };

  /**
   * Returns the current user hint for immediate-mode authorization
   * flows.
   * @return {?string} The user hint, or null if no hint is set.
   */
  oauth2.core.getUserHint = function() {
    return oauth2userHint;
  };

  /**
   * Generates the URL for an OAuth 2 end-user authorization flow.
   * @param {boolean} If true, the authorization flow will use the
   *     "immediate" mode which is IFRAME-able and skips all user
   *     interface and either immediately succeeds (due to prior
   *     approval) or fails; otherwise user interface may be
   *     displayed and the flow is not IFRAME-able.
   * @return {string} The authorization URL.
   */
  oauth2.core.getAuthUrl = function(isImmediate) {
    var sessionIndex = oauth2.core.getSessionIndex();
    var hostedDomain = oauth2.core.getHostedDomain();
    var urlParts = [];
    // Request an access token.
    urlParts.push(
        config.AUTH_URL +
        '?' +
        encodeURIComponent(config.RESPONSE_TYPE_PARAM) +
        '=' +
        encodeURIComponent(config.RESPONSE_TYPE_ACCESS_TOKEN_PARAM_VALUE));
    if (clientId) {
      // Client ID.
      urlParts.push(
          encodeURIComponent(config.CLIENT_ID_PARAM) +
          '=' +
          encodeURIComponent(clientId));
    }
    if (scopes) {
      // Authorization scopes.
      urlParts.push(
          encodeURIComponent(config.SCOPE_PARAM) +
          '=' +
          encodeURIComponent(scopes));
    }
    // State to prevent replay and spoofing attacks.
    urlParts.push(
        encodeURIComponent(config.STATE_PARAM) +
        '=' +
        encodeURIComponent(config.AUTH_STATE));
    // Request postMessage result return
    urlParts.push(
        encodeURIComponent(config.POSTMESSAGE_PARAM) +
        '=' +
        encodeURIComponent(config.POSTMESSAGE_PARAM_VALUE));
    // Proxy IFRAME ID for postMessage result return.
    urlParts.push(
        encodeURIComponent(config.PROXY_PARAM) +
        '=' +
        encodeURIComponent(config.PROXY_ID));
    // Application URL origin for postMessage.
    urlParts.push(
        encodeURIComponent(config.ORIGIN_PARAM) +
        '=' +
        encodeURIComponent(config.ORIGIN));
    if (isImmediate) {
      urlParts.push(
          encodeURIComponent(config.IMMEDIATE_PARAM) +
          '=' +
          encodeURIComponent(config.IMMEDIATE_PARAM_VALUE));
      if (oauth2userHint) {
        urlParts.push(
            encodeURIComponent(config.USER_ID_PARAM) +
            '=' +
            encodeURIComponent(oauth2userHint));
        sessionIndex = null;
        hostedDomain = null;
      } else if (!(sessionIndex || hostedDomain)) {
        sessionIndex = '0';
      }
    }
    if (sessionIndex) {
      urlParts.push(
          encodeURIComponent(config.SESSION_INDEX_PARAM) +
          '=' +
          encodeURIComponent(sessionIndex));
    }
    if (hostedDomain) {
      urlParts.push(
          encodeURIComponent(config.HOSTED_DOMAIN_PARAM) +
          '=' +
          encodeURIComponent(hostedDomain));
    }
    return urlParts.join('&');
  };

})();
