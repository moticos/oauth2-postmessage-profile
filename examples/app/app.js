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

if (typeof(app) == 'undefined') {
  app = {};
}

(function() {

  var imports = {
    addListener: dom.util.addListener,

    checkAuthImmediate: oauth2.authWindow.checkImmediate,
    closeAuthWindow: oauth2.authWindow.close,
    focusAuthWindowOrCheckImmediate: oauth2.authWindow.focusOrCheckImmediate,
    cancelAuthClick: oauth2.authWindow.handleCloseEvent,
    showAuthWindow: oauth2.authWindow.open,
    setCheckAuthCallback: oauth2.authWindow.setCheckCallback,
    setClientId: oauth2.core.setClientId,
    setScopes: oauth2.core.setScopes,
    setUserHint: oauth2.core.setUserHint,
    oauth2callback: oauth2.relay.oauth2callback,
    startRelay: oauth2.relay.start,
    checkUserInfo: oauth2.userinfo.check,

    showLightbox: ui.lightbox.open,
    showUserInfo: ui.userinfo.show
  };

  var config = {
    AUTH_REQUIRED_LIGHTBOX_TITLE: app.config.AUTH_REQUIRED_LIGHTBOX_TITLE,
    AUTH_REQUIRED_LIGHTBOX_DESCRIPTION:
        app.config.AUTH_REQUIRED_LIGHTBOX_DESCRIPTION,
    AUTH_REQUIRED_LIGHTBOX_AUTHORIZE_BUTTON_TEXT:
        app.config.AUTH_REQUIRED_LIGHTBOX_AUTHORIZE_BUTTON_TEXT,
    AUTH_REQUIRED_LIGHTBOX_CANCEL_BUTTON_TEXT:
        app.config.AUTH_REQUIRED_LIGHTBOX_CANCEL_BUTTON_TEXT,
    CLIENT: app.config.CLIENT,
    SCOPE: app.config.SCOPE,

    AUTH_STATE: oauth2.core.config.AUTH_STATE,
    ERROR_VIRTUAL_USER_CANCELLED:
        oauth2.core.config.ERROR_VIRTUAL_USER_CANCELLED,
    ERROR_VIRTUAL_USER_DISCARDED:
    oauth2.core.config.ERROR_VIRTUAL_USER_DISCARDED
  };

  var lastAccessToken = null;
  var lastUserInfo = null;

  /**
   * Callback invoked when the OAuth 2 postMessage relay is
   * ready. Begins an immediate-mode authorization check in a hidden
   * IFRAME.
   * @private
   */
  var authReadyCallback_ = function() {
    imports.checkAuthImmediate();
  };

  /**
   * Callback invoked when the authorization flow state
   * changes. Updates authorization flow state indicator widgets.
   * @param {boolean} isCheckingAuth True when an authorization check
   *     is in progress and false otherwise.
   * @private
   */
  var checkingAuthCallback_ = function(isCheckingAuth) {
    document.getElementById('checking-auth').style.display =
        isCheckingAuth ? '' : 'none';
    document.getElementById('not-checking-auth').style.display =
        isCheckingAuth ? 'none' : '';
    if (isCheckingAuth) {
      document.getElementById('auth-required').style.display = 'none';
    }
  };

  /**
   * Show the authorization request lightbox.
   * @private
   */
  var showAuthRequiredLightbox_ = function() {
    imports.showLightbox(
        'auth-window-glass',
        config.AUTH_REQUIRED_LIGHTBOX_TITLE,
        config.AUTH_REQUIRED_LIGHTBOX_DESCRIPTION,
        config.AUTH_REQUIRED_LIGHTBOX_AUTHORIZE_BUTTON_TEXT,
        config.AUTH_REQUIRED_LIGHTBOX_CANCEL_BUTTON_TEXT,
        imports.cancelAuthClick,
        imports.showAuthWindow).focus();
  };

  /**
   * Discard any stored authorization token; simulates part of a "sign
   * out" but does not actually de-authorize the application.
   * @private
   */
  var discardAuth_ = function() {
    imports.oauth2callback(
        '?error=' + encodeURIComponent(config.ERROR_VIRTUAL_USER_DISCARDED) +
        '&state=' + encodeURIComponent(config.AUTH_STATE));
  };

  /**
   * Callback to invoke when an OAuth 2 response is received. Updates
   * the authorization flow state indicator widgets, and (if
   * appropriate) either shows the authorization request lightbox or
   * starts a user information fetch.
   * @param {?string} accessToken OAuth 2 access token or null.
   * @param {?string} error OAuth 2 error code or null.
   * @type {?oauth2.relay.AuthCallback}
   * @private
   */
  var authCallback_ = function(accessToken, error) {
    imports.closeAuthWindow();
    if (lastAccessToken &&
        (error == config.ERROR_VIRTUAL_USER_CANCELLED)) {
      accessToken = lastAccessToken;
    } else if (error == config.ERROR_VIRTUAL_USER_DISCARDED) {
      imports.setUserHint(null);
    }
    document.getElementById('auth-required').style.display =
        accessToken ? 'none' : '';
    document.getElementById('authorized').style.display =
        accessToken ? '' : 'none';
    lastUserInfo = null;
    imports.showUserInfo('user-info', lastUserInfo);
    if (!accessToken) {
      lastAccessToken = null;
      if (error == 'immediate_failed') {
        showAuthRequiredLightbox_();
      }
    } else {
      lastAccessToken = accessToken;
      imports.checkUserInfo(accessToken, userInfoCallback_);
    }
  };

  /**
   * Response handler for user information. Updates or resets user
   * hint for subsequent immediate-mode authorization flows, and
   * displays any user information in the user information widget.
   * @param {?oauth2.userinfo.UserInfo} userInfo Fetched user
   *     information, or null if no user information was fetched.
   * @private
   */
  var userInfoCallback_ = function(userInfo) {
    lastUserInfo = userInfo;
    if (lastUserInfo && lastUserInfo.email) {
      imports.setUserHint(lastUserInfo.email);
    } else {
      imports.setUserHint(null);
    }
    imports.showUserInfo('user-info', lastUserInfo);
  };

  /**
   * Click handler for the user information widget. Opens the user's
   * profile page (if they have one) in a new window.
   * @private
   */
  var userInfoClick_ = function() {
    if (lastUserInfo && lastUserInfo.profileUrl) {
      window.open(lastUserInfo.profileUrl, '_blank');
    }
  };

  /** Initialize the application */
  app.init = function() {
    imports.setClientId(config.CLIENT);
    imports.setScopes(config.SCOPE);
    imports.startRelay(authReadyCallback_, authCallback_);
    imports.setCheckAuthCallback(checkingAuthCallback_);
    imports.addListener('cancel-auth-button', 'click', imports.cancelAuthClick);
    imports.addListener('auth-button', 'click', imports.showAuthWindow);
    imports.addListener(
        'auth-retry-button',
        'click',
        imports.checkAuthImmediate);
    imports.addListener(
        'auth-refresh-button',
        'click',
        imports.checkAuthImmediate);
    imports.addListener(
        'restart-auth-button',
        'click',
        imports.focusAuthWindowOrCheckImmediate);
    imports.addListener('auth-discard-button', 'click', discardAuth_);
    imports.addListener('user-info', 'click', userInfoClick_);
  };

})();

// Schedule the application code to start once the page has finished loading.
dom.util.addListener(window, 'load', app.init);
