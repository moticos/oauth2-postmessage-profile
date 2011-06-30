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

/**
 * Pop-up window + lightbox authorization flow and an immediate-mode
 * hidden IFRAME authorization flow for OAuth 2.
 */
oauth2.authWindow = oauth2.authWindow || {};

(function() {

  var imports = {
    addListener: dom.util.addListener,
    getBodyElement: dom.util.getBodyElement,
    openHiddenFrame: dom.util.openHiddenFrame,
    removeElementById: dom.util.removeElementById,

    getAuthUrl: oauth2.core.getAuthUrl,
    getHostedDomain: oauth2.core.getHostedDomain,
    oauth2callback: oauth2.relay.oauth2callback,

    showLightbox: ui.lightbox.open
  };

  var config = {
    HEIGHT: oauth2.authWindow.config.HEIGHT,
    HOSTED_DOMAIN_HEIGHT: oauth2.authWindow.config.HOSTED_DOMAIN_HEIGHT,
    HOSTED_DOMAIN_WIDTH: oauth2.authWindow.config.HOSTED_DOMAIN_WIDTH,
    LIGHTBOX_AUTHORIZE_BUTTON_TEXT:
        oauth2.authWindow.config.LIGHTBOX_AUTHORIZE_BUTTON_TEXT,
    LIGHTBOX_CANCEL_BUTTON_TEXT:
        oauth2.authWindow.config.LIGHTBOX_CANCEL_BUTTON_TEXT,
    LIGHTBOX_DESCRIPTION: oauth2.authWindow.config.LIGHTBOX_DESCRIPTION,
    LIGHTBOX_TITLE: oauth2.authWindow.config.LIGHTBOX_TITLE,
    WATCH_INTERVAL_MS: oauth2.authWindow.config.WATCH_INTERVAL_MS,
    WIDTH: oauth2.authWindow.config.WIDTH,

    AUTH_STATE: oauth2.core.config.AUTH_STATE,
    ERROR_VIRTUAL_USER_CANCELLED:
    oauth2.core.config.ERROR_VIRTUAL_USER_CANCELLED
  };

  var authWindow = null;
  var pollAuthWindowHandler = null;
  var authWindowCleanupScheduled = false;
  var authWindowCheckingAuthCallback = null;

  /** Focus an existing auth window or show a new one. */
  oauth2.authWindow.open = function() {
    if (pollAuthWindowHandler) {
      try {
        if (authWindow &&
            ((typeof(authWindow.closed) == 'undefined') ||
             (!authWindow.closed))) {
          authWindow.focus();
          return;
        }
      } catch (windowFocusException) {
      }
    }
    oauth2.authWindow.close();
    scheduleAuthWindowCleanup_();
    authWindowCheckingAuthCallback(true);
    var width = config.WIDTH, height = config.HEIGHT;
    if (imports.getHostedDomain()) {
      width = config.HOSTED_DOMAIN_WIDTH;
      height = config.HOSTED_DOMAIN_HEIGHT;
    }
    var left = (screen.width - width) / 2, top = (screen.height - height) / 2;
    if (width > screen.availWidth) {
      width = screen.availWidth;
    }
    if (height > screen.availHeight) {
      height = screen.availHeight;
    }
    if (width > screen.width) {
      width = screen.width;
    }
    if (height > screen.height) {
      height = screen.height;
    }
    var body = imports.getBodyElement();
    var screenX = window.screenLeft || window.screenX || 0;
    var screenY = window.screenTop || window.screenY || 0;
    var innerWidth = window.innerWidth || body && body.clientWidth || 0;
    var innerHeight = window.innerHeight || body && body.clientHeight || 0;
    if (innerWidth && innerHeight &&
        (screenX != null) && (screenY != null)) {
      left = screenX + (innerWidth - width) / 2;
      top = screenY + (innerHeight - height) / 2;
    }
    if (left + width > screen.availWidth) {
      left = screen.availWidth - width;
    }
    if (top + height > screen.availHeight) {
      top = screen.availHeight - height;
    }
    if (left < screen.availLeft) {
      left = screen.availLeft;
    }
    if (top < screen.availTop) {
      top = screen.availTop;
    }
    if (left + width > screen.width) {
      left = screen.width - width;
    }
    if (top + height > screen.height) {
      top = screen.height - top;
    }
    if (left < 0) {
      left = 0;
    }
    if (top < 0) {
      top = 0;
    }
    features = [
        'toolbar=no',
        'location=' + (window.opera ? 'no' : 'yes'),
        'directories=no',
        'status=no',
        'menubar=no',
        'scrollbars=yes',
        'resizable=yes',
        'copyhistory=no',
        'width=' + width,
        'height=' + height,
        'top=' + top,
        'left=' + left];
    showAuthWindowLightbox().focus();
    var authUrl = imports.getAuthUrl(false);
    authWindow = window.open(authUrl, '_blank', String(features));
    watchAuthWindow_();
  };

  var showAuthWindowLightbox = function() {
    scheduleAuthWindowCleanup_();
    return imports.showLightbox(
        'auth-window-glass',
        config.LIGHTBOX_TITLE,
        config.LIGHTBOX_DESCRIPTION,
        config.LIGHTBOX_AUTHORIZE_BUTTON_TEXT,
        config.LIGHTBOX_CANCEL_BUTTON_TEXT,
        oauth2.authWindow.handleCloseEvent,
        oauth2.authWindow.open);
  };

  /**
   * Focus an existing authorization window or start an
   * immediate-mode authorization flow.
   */
  oauth2.authWindow.focusOrCheckImmediate = function() {
    if (pollAuthWindowHandler) {
      oauth2.authWindow.open();
    } else {
      oauth2.authWindow.checkImmediate();
    }
  };

  /**
   * Set the callback to be notified when the authorization flow
   * state changes.
   * @param {function(boolean)} checkingAuthCallback The callback to
   *     invoke when authorization flow state changes. It will be
   *     passed a boolean which will be true when an authorization
   *     check is in progress and false otherwise.
   */
  oauth2.authWindow.setCheckCallback = function(checkingAuthCallback) {
    authWindowCheckingAuthCallback = checkingAuthCallback;
  };

  /** Do an immediate-mode authorization flow in a hidden IFRAME. */
  oauth2.authWindow.checkImmediate = function() {
    oauth2.authWindow.close();
    scheduleAuthWindowCleanup_();
    authWindowCheckingAuthCallback(true);
    var authUrl = imports.getAuthUrl(true);
    imports.openHiddenFrame(authUrl, 'immediate-auth-frame').tabIndex = '-1';
  };

  /** Cancel the authorization flow by injecting a virtual OAuth 2 error. */
  oauth2.authWindow.handleCloseEvent = function() {
    imports.oauth2callback(
        '?error=' + encodeURIComponent(config.ERROR_VIRTUAL_USER_CANCELLED) +
        '&state=' + encodeURIComponent(config.AUTH_STATE));
  };

  /** Cancel any outstanding authorization flow. */
  oauth2.authWindow.close = function() {
    authWindowCheckingAuthCallback(false);
    imports.removeElementById('immediate-auth-frame');
    try {
      authWindow.close();
    } catch (authWindowCloseException) {
    }
    authWindow = null;
    if (pollAuthWindowHandler != null) {
      try {
        window.clearTimeout(pollAuthWindowHandler);
      } catch (clearTimeoutException) {
      }
      pollAuthWindowHandler = null;
    }
    imports.removeElementById('auth-window-glass');
  };

  /**
   * Handler which checks to see whether the authorization window
   * has been closed.
   * @private
   */
  var watchAuthWindow_ = function() {
    pollAuthWindowHandler = null;
    var closed = false;
    try {
      if (!authWindow) {
        closed = true;
      }
    } catch (authWindowFalsinessException) {
    }
    try {
      if (authWindow.closed) {
        closed = true;
      }
    } catch (authWindowClosedException) {
    }
    var glass = document.getElementById('auth-window-glass');
    if (closed) {
      if (glass) {
        glass.parentNode.removeChild(glass);
      }
      authWindowCheckingAuthCallback(false);
      oauth2.authWindow.handleCloseEvent();
    } else {
      pollAuthWindowHandler = setTimeout(
          watchAuthWindow_,
          config.WATCH_INTERVAL_MS);
      if (!glass) {
        showAuthWindowLightbox();
      }
    }
  };

  /**
   * Ensure authorization window cleanup will be attempted on
   * unload.
   * @private
   */
  var scheduleAuthWindowCleanup_ = function() {
    if (!authWindowCleanupScheduled) {
      authWindowCleanupScheduled = true;
      imports.addListener(window, 'unload', oauth2.authWindow.close);
    }
  };

})();
