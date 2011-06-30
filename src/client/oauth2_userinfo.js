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

/** Fetcher for user profile information. */
oauth2.userinfo = oauth2.userinfo || {};

(function() {

  var imports = {
    createHtmlElement: dom.util.createHtmlElement,
    getBodyElement: dom.util.getBodyElement,
    removeElementById: dom.util.removeElementById
  };

  var config = {
    ACCESS_TOKEN_PARAM: oauth2.core.config.ACCESS_TOKEN_PARAM,

    CALLBACK_PARAM: oauth2.userinfo.config.CALLBACK_PARAM,
    CALLBACK_PREFIX: oauth2.userinfo.config.CALLBACK_PREFIX,
    SCRIPT_ID_PREFIX: oauth2.userinfo.config.SCRIPT_ID_PREFIX,
    USER_INFO: oauth2.userinfo.config.USER_INFO
  };

  /**
   * @typedef {{email: ?string, displayName: ?string, thumbnailUrl:
   *     ?string, id: ?string}}
   */
  oauth2.userinfo.UserInfo;

  /**
   * Handler for user profile information which reformats it into
   * oauth2.userinfo.UserInfo form and passes it to the supplied
   * callback.
   * @param {?Object} data Raw JSON-P response.
   * @param {function(?oauth2.userinfo.UserInfo)} callback Response
   *     handler to invoke with the reformatted user information, or
   *     null if the response has no data payload.
   * @private
   */
  var userInfoHandler_ = function(data, callback) {
    var userInfo = null;
    var payload = data['data'];
    if (payload) {
      userInfo = {};
      userInfo.id = payload['id'];
      userInfo.displayName = payload['displayName'];
      userInfo.thumbnailUrl = payload['thumbnailUrl'];
      userInfo.profileUrl = payload['profileUrl'];
      var emails = payload['emails'];
      if (emails) {
        for (var i = 0, maxi = emails.length; i < maxi; ++i) {
          var email = emails[i];
          if (email['primary'] || !userInfo.email) {
            userInfo.email = email['value'];
          }
        }
      }
    }
    callback(userInfo);
  };

  /**
   * Given a suitably-scoped access token, fetch user profile
   * information. This implementation uses the Buzz API.
   * @param {?string} accessToken OAuth 2 access token with which to
   *     authorize the API call.
   * @param {function(?oauth2.userinfo.UserInfo)} callback Response
   *     handler to invoke with the fetched user information.
   */
  oauth2.userinfo.check = function(accessToken, callback) {
    var id = String((0x7fffffff * shindig.random()) | 0);
    var scriptId = config.SCRIPT_ID_PREFIX + id;
    var callbackName = config.CALLBACK_PREFIX + id;
    // TODO: switch to a real URI class for this
    var userInfoUrl = (
        config.USER_INFO +
        '&' +
        (encodeURIComponent(config.CALLBACK_PARAM) +
         '=' +
         encodeURIComponent(callbackName)) +
        (accessToken ?
         ('&' +
          encodeURIComponent(config.ACCESS_TOKEN_PARAM) +
          '=' +
          encodeURIComponent(accessToken)) :
         ''));
    var script = imports.createHtmlElement('script');
    script.id = scriptId;
    window[callbackName] = function(data) {
      setTimeout(function() {
          imports.removeElementById(scriptId);
        }, 1);
      userInfoHandler_(data, callback);
      try {
        delete window[callbackName];
      } catch (deleteWindowPropertyException) {
        window[callbackName] = void(0);
      }
    };
    script.src = userInfoUrl;
    imports.getBodyElement().appendChild(script);
  };

})();
