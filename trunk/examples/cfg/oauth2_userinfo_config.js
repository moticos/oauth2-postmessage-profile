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

/** Configuration for fetching user profile information. */
oauth2.userinfo.config = oauth2.userinfo.config || {};

(function() {

  var api = 'https://www.googleapis.com/buzz/v1';

  /**
   * Prefix for JSON-P callback name.
   * @type {string}
   */
  oauth2.userinfo.config.CALLBACK_PREFIX = '_oauth2UserInfoHandler';

  /**
   * Prefix for JSON-P script element ID.
   * @type {string}
   */
  oauth2.userinfo.config.SCRIPT_ID_PREFIX = 'oauth2userInfoDataRequest';

  /**
   * URL for fetching JSON-P profile information.
   * @type {string}
   */
  oauth2.userinfo.config.USER_INFO = api + '/people/@me/@self' +
      '?alt=json';

  /**
   * URL parameter name for JSON-P callback.
   * @type {string}
   */
  oauth2.userinfo.config.CALLBACK_PARAM = 'callback';

})();
