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

/** Creates and manages a postMessage relay (a.k.a. "proxy") IFRAME. */
oauth2.relay = oauth2.relay || {};

(function() {

  var imports = {
    setChannelHandler: dom.channels.setHandler,
    setupFrame: dom.channels.setupFrame,
    openHiddenFrame: dom.util.openHiddenFrame,
    removeElementById: dom.util.removeElementById
  };

  var config = {
    FORCE_SECURE_HASHPARAM: dom.channels.config.FORCE_SECURE_HASHPARAM,
    FORCE_SECURE_HASHPARAM_VALUE:
        dom.channels.config.FORCE_SECURE_HASHPARAM_VALUE,
    RPC_TOKEN_HASHPARAM: dom.channels.config.RPC_TOKEN_HASHPARAM,
    PARENT_ORIGIN_PARAM: dom.channels.config.PARENT_ORIGIN_PARAM,

    ACCESS_TOKEN_RESULT_PARAM: oauth2.core.config.ACCESS_TOKEN_RESULT_PARAM,
    AUTH_STATE: oauth2.core.config.AUTH_STATE,
    ERROR_RESULT_PARAM: oauth2.core.config.ERROR_RESULT_PARAM,
    ERROR_VIRTUAL_STATE_MISMATCH:
        oauth2.core.config.ERROR_VIRTUAL_STATE_MISMATCH,
    ORIGIN: oauth2.core.config.ORIGIN,
    PROXY_ID: oauth2.core.config.PROXY_ID,
    STATE_RESULT_PARAM: oauth2.core.config.STATE_RESULT_PARAM,

    CALLBACK_CHANNEL: oauth2.relay.config.CALLBACK_CHANNEL,
    PROXY_READY_CHANNEL: oauth2.relay.config.PROXY_READY_CHANNEL,
    RPC_TOKEN: oauth2.relay.config.RPC_TOKEN,
    PROXY_URL: oauth2.relay.config.PROXY_URL
  };

  /**
   * Type for auth callbacks. First parameter is an access token or
   * null; second parameter is an error code or null.
   * @typedef {function(?string, ?string)}
   */
  oauth2.relay.AuthCallback;

  /**
   * Callback to invoke when the relay is ready.
   * @type {function()}
   */
  var relayReadyCallback = null;

  /**
   * Callback to invoke when an OAuth 2 response is received. Takes
   * two parameters, an optional access token and an optional error
   * code.
   * @type {?oauth2.relay.AuthCallback}
   */
  var relayAuthCallback = null;

  /**
   * Internal handler for realy ready event. Sets up OAuth 2
   * response channel handler and invokes application-provided ready
   * callback.
   * @this {Object}
   * @private
   */
  var oauth2relayReady_ = function() {
    imports.setChannelHandler(config.PROXY_READY_CHANNEL, config.PROXY_ID);
    imports.setChannelHandler(
        config.CALLBACK_CHANNEL,
        config.PROXY_ID,
        oauth2.relay.oauth2callback);
    relayReadyCallback();
  };

  /**
   * Internal handler for OAuth 2 responses. May be directly invoked
   * to process synthetic responses.
   * @param {string} result URI-formatted OAuth 2 response.
   * @this {Object}
   */
  oauth2.relay.oauth2callback = function(result) {
    var resultParsed = shindig.uri(result);
    var accessToken = resultParsed.getFP(config.ACCESS_TOKEN_RESULT_PARAM);
    var error = (
        resultParsed.getFP(config.ERROR_RESULT_PARAM) ||
        resultParsed.getQP(config.ERROR_RESULT_PARAM));
    var state = (
        resultParsed.getFP(config.STATE_RESULT_PARAM) ||
        resultParsed.getQP(config.STATE_RESULT_PARAM));
    if (state != config.AUTH_STATE) {
      accessToken = null;
      error = config.ERROR_VIRTUAL_STATE_MISMATCH;
    }
    relayAuthCallback(accessToken, error);
  };

  /**
   * Start (or restart) the OAuth 2 postMessage relay IFRAME.
   * @param {function()} readyCallback Callback to invoke when the
   *     relay is ready to forward results.
   * @param {oauth2.relay.AuthCallback} authCallback Callback to
   *     invoke when a result is received.
   */
  oauth2.relay.start = function(readyCallback, authCallback) {
    oauth2.relay.stop();
    relayReadyCallback = readyCallback;
    relayAuthCallback = authCallback;
    // TODO: switch to a real URI class for this
    var proxyUrl = (
        config.PROXY_URL +
        '?' +
        (encodeURIComponent(config.PARENT_ORIGIN_PARAM) +
         '=' +
         encodeURIComponent(config.ORIGIN)) +
        '#' +
        (encodeURIComponent(config.RPC_TOKEN_HASHPARAM) +
         '=' +
         encodeURIComponent(config.RPC_TOKEN)) +
        '&' +
        (encodeURIComponent(config.FORCE_SECURE_HASHPARAM) +
         '=' +
         encodeURIComponent(config.FORCE_SECURE_HASHPARAM_VALUE)));
    var postmessageRelayFrame = imports.openHiddenFrame(
        proxyUrl,
        config.PROXY_ID);
    postmessageRelayFrame.tabIndex = '-1';
    dom.channels.setupFrame(config.PROXY_ID);
    imports.setChannelHandler(
        config.PROXY_READY_CHANNEL,
        config.PROXY_ID,
        oauth2relayReady_);
  };

  /** Stop the postMessage relay. */
  oauth2.relay.stop = function() {
    relayAuthCallback = null;
    relayReadyCallback = null;
    imports.removeElementById(config.PROXY_ID);
    imports.setChannelHandler(config.PROXY_READY_CHANNEL, config.PROXY_ID);
    imports.setChannelHandler(config.CALLBACK_CHANNEL, config.PROXY_ID);
  };

})();
