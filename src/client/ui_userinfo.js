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

if (typeof(ui) == 'undefined') {
  ui = {};
}

/** Widget to display user information fetched by oauth2.userinfo. */
ui.userinfo = ui.userinfo || {};

(function() {

  var imports = {
    addListener: dom.util.addListener,
    createHtmlElement: dom.util.createHtmlElement,
    removeElementById: dom.util.removeElementById
  };

  var config = {
    NO_DISPLAY_NAME_TEXT: ui.userinfo.config.NO_DISPLAY_NAME_TEXT,
    NO_EMAIL_TEXT: ui.userinfo.config.NO_EMAIL_TEXT
  };

  /**
   * Render profile information into a pre-existing widget DOM
   * element and show it, or hide it if no profile information is
   * provided.
   * @param {string} id Element ID of the pre-existing widget DOM
   *     element.
   * @param {?oauth2.userinfo.UserInfo} userInfo User information to
   *     display, or null to hide the widget.
   */
  ui.userinfo.show = function(id, userInfo) {
    var userInfoWidget = document.getElementById(id);
    while (userInfoWidget.firstChild) {
      userInfoWidget.removeChild(userInfoWidget.firstChild);
    }
    if (userInfo) {
      if (userInfo.thumbnailUrl) {
        var image = userInfoWidget.appendChild(
            imports.createHtmlElement('img'));
        image.id = id + '-thumbnail';
        imports.addListener(image, 'error', function() {
            imports.removeElementById(id + '-thumbnail');
          });
        image.src = userInfo.thumbnailUrl;
      }
      userInfoWidget.appendChild(
          imports.createHtmlElement('h4')).appendChild(
              document.createTextNode(
                  userInfo.displayName ||
                  config.NO_DISPLAY_NAME_TEXT));
      userInfoWidget.appendChild(
          imports.createHtmlElement('div')).appendChild(
              document.createTextNode(
                  userInfo.email ||
                  config.NO_EMAIL_TEXT));
      if (userInfo.id) {
        userInfoWidget.title = userInfo.id;
      }
      userInfoWidget.style.display = '';
    } else {
      userInfoWidget.style.display = 'none';
    }
  };

})();
