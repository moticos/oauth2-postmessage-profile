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

/** Configuration for the OAuth 2 postMessage flow example. */
app.config = app.config || {};

/**
 * Title for the authorization request lightbox.
 * @type {string}
 */
app.config.AUTH_REQUIRED_LIGHTBOX_TITLE = 'Authorization Request';

/**
 * Description text for the authorization request lightbox.
 * @type {string}
 */
app.config.AUTH_REQUIRED_LIGHTBOX_DESCRIPTION =
    'This \u201cOAuth 2 postMessage flow example\u201d application displays' +
    ' data associated with your account. To do this, it needs your permission.';

/**
 * Label for the button which starts the authorization flow.
 * @type {string}
 */
app.config.AUTH_REQUIRED_LIGHTBOX_AUTHORIZE_BUTTON_TEXT = 'Get started\u2026';

/**
 * Label for the button which dismisses the authorization request
 * lightbox.
 * @type {string}
 */
app.config.AUTH_REQUIRED_LIGHTBOX_CANCEL_BUTTON_TEXT = 'Cancel';

/**
 * OAuth 2 client ID.
 * @type {string}
 */
app.config.CLIENT = '1031445332935';

/**
 * Required OAuth 2 access scope or scopes.
 * @type {string|Array.<string>}
 */
app.config.SCOPE = ['https://www.googleapis.com/auth/buzz.readonly'];
