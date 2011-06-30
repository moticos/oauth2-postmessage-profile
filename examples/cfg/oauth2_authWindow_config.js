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

/**
 * Configuration for pop-up window + lightbox authorization flow and
 * an immediate-mode hidden IFRAME authorization flow for OAuth 2.
 */
oauth2.authWindow.config = oauth2.authWindow.config || {};

/**
 * Title for the lightbox behind the authorization pop-up.
 * @type {string}
 */
oauth2.authWindow.config.LIGHTBOX_TITLE = 'Authorizing\u2026';

/**
 * Description text for the lightbox behind the authorization pop-up.
 * @type {string}
 */
oauth2.authWindow.config.LIGHTBOX_DESCRIPTION =
    'Waiting for your authorization.';

/**
 * Label for the button which re-focusses the authorization pop-up.
 * @type {string}
 */
oauth2.authWindow.config.LIGHTBOX_AUTHORIZE_BUTTON_TEXT =
    'Show authorization window \u00bb';

/**
 * Label for the button which closes the authorization pop-up and
 * cancels the authorization flow.
 * @type {string}
 */
oauth2.authWindow.config.LIGHTBOX_CANCEL_BUTTON_TEXT = 'Cancel';

/**
 * Initial width in pixels for the authorization pop-up for regular
 * Google accounts.
 * @type {number}
 */
oauth2.authWindow.config.WIDTH = 650;

/**
 * Initial width in pixels for the authorization pop-up for regular
 * Google accounts.
 * @type {number}
 */
oauth2.authWindow.config.HEIGHT = 600;

/**
 * Initial width in pixels for the authorization pop-up for Google
 * Apps hosted domain accounts.
 * @type {number}
 */
oauth2.authWindow.config.HOSTED_DOMAIN_WIDTH = 800;

/**
 * Initial height in pixels for the authorization pop-up for Google
 * Apps hosted domain accounts.
 * @type {number}
 */
oauth2.authWindow.config.HOSTED_DOMAIN_HEIGHT = 620;

/**
 * Polling interval in milliseconds for checking to see whether the
 * authorization pop-up has been closed.
 * @type {number}
 */
oauth2.authWindow.config.WATCH_INTERVAL_MS = 500; // milliseconds
