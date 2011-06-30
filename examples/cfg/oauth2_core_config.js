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

/** Configuration for OAuth 2. */
oauth2.core.config = oauth2.core.config || {};

(function() {

  var imports = {
    getOrigin: dom.util.getOrigin
  };

  /**
   * URL parameter name for passing an access token to access a
   * protected resource.
   * @type {string}
   */
  oauth2.core.config.ACCESS_TOKEN_PARAM = 'oauth_token';

  /**
   * URL prefix for the OAuth 2 authorization server, a.k.a. the
   * "identifying party".
   * @type {string}
   */
  oauth2.core.config.IDP = 'https://accounts.google.com/o/oauth2/';

      /**
       * URL for OAuth 2 end-user authorization.
       * @type {string}
       */
  oauth2.core.config.AUTH_URL = oauth2.core.config.IDP + 'auth';

  /**
   * URL parameter name for specifying response type.
   * @type {string}
   */
  oauth2.core.config.RESPONSE_TYPE_PARAM = 'response_type';

  /**
   * URL parameter value for specifying access token response type.
   * @type {string}
   */
  oauth2.core.config.RESPONSE_TYPE_ACCESS_TOKEN_PARAM_VALUE = 'token';

  /**
   * URL parameter name for requesting postMessage flow.
   * @type {string}
   */
  oauth2.core.config.POSTMESSAGE_PARAM = 'redirect_uri';

  /**
   * URL parameter value for requesting postMessage flow.
   * @type {string}
   */
  oauth2.core.config.POSTMESSAGE_PARAM_VALUE = 'postmessage';

  /**
   * URL parameter name for postMessage relay proxy IFRAME id.
   * @type {string}
   */
  oauth2.core.config.PROXY_PARAM = 'proxy';

  /**
   * postMessage relay proxy IFRAME id.
   * @type {string}
   */
  oauth2.core.config.PROXY_ID = 'oauth2-relay-frame';

  /**
   * URL parameter name for URL origin for the application.
   * @type {string}
   */
  oauth2.core.config.ORIGIN_PARAM = 'origin';

  /**
   * URL origin for the application.
   * @type {string}
   */
  oauth2.core.config.ORIGIN = imports.getOrigin();

  /**
   * URL parameter name for the opaque application state.
   * @type {string}
   */
  oauth2.core.config.STATE_PARAM = 'state';

  /**
   * A pseudorandom number sent in the "state" parameter and
   * verified in responses to prevent replay and spoofing attacks.
   * @type {string}
   */
  oauth2.core.config.AUTH_STATE = String(shindig.random());

  /**
   * URL parameter name for the client ID.
   * @type {string}
   */
  oauth2.core.config.CLIENT_ID_PARAM = 'client_id';

  /**
   * URL parameter name for the authorization scope list.
   * @type {string}
   */
  oauth2.core.config.SCOPE_PARAM = 'scope';

  /**
   * URL parameter name for the user hint.
   * @type {string}
   */
  oauth2.core.config.USER_ID_PARAM = 'user_id';

  /**
   * URL parameter name for "immediate mode" which skips the
   * approval UI and either immediately fails (no prior
   * authorization) or succeeds (prior authorization implying
   * automatic approval.)
   * @type {string}
   */
  oauth2.core.config.IMMEDIATE_PARAM = 'immediate';

  /**
   * URL parameter value for IMMEDIATE_PARAM to request "immediate
   * mode".
   * @type {string}
   */
  oauth2.core.config.IMMEDIATE_PARAM_VALUE = 'true';

  /**
   * URL parameter name for session index for Google's multiple
   * sign-in system.
   * @type {string}
   */
  oauth2.core.config.SESSION_INDEX_PARAM = 'authuser';

  /**
   * URL parameter name for Google Apps hosted domain.
   * @type {string}
   */
  oauth2.core.config.HOSTED_DOMAIN_PARAM = 'hd';

  /**
   * URL parameter name for access token returns.
   * @type {string}
   */
  oauth2.core.config.ACCESS_TOKEN_RESULT_PARAM = 'access_token';

  /**
   * URL parameter name for error returns.
   * @type {string}
   */
  oauth2.core.config.ERROR_RESULT_PARAM = 'error';

  /**
   * URL parameter name for opaque application state returns.
   * @type {string}
   */
  oauth2.core.config.STATE_RESULT_PARAM = 'state';

  /**
   * Virtual error code injected when the user cancels the
   * authorization flow e.g. by closing an authorization pop-up or
   * by pressing the "cancel" button in a lightbox.
   * @type {string}
   */
  oauth2.core.config.ERROR_VIRTUAL_USER_CANCELLED = 'VIRTUAL_user_cancelled';

  /**
   * Virtual error code injected when the user or application
   * desires to discard a previously fetched access token.
   * @type {string}
   */
  oauth2.core.config.ERROR_VIRTUAL_USER_DISCARDED = 'VIRTUAL_user_discarded';

  /**
   * Virtual error code injected in place of the actual response
   * when a mismatched or missing "state" parameter is detected,
   * indicating a possible replay or spoofing attack.
   * @type {string}
   */
  oauth2.core.config.ERROR_VIRTUAL_STATE_MISMATCH = 'VIRTUAL_state_mismatch';

})();
