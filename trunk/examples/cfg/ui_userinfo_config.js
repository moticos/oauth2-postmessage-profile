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

/** Configuration for user information widget. */
ui.userinfo.config = ui.userinfo.config || {};

/**
 * Text to display in place of a missing display name.
 * @type {string}
 */
ui.userinfo.config.NO_DISPLAY_NAME_TEXT = 'No display name';

/**
 * Text to display in place of a missing email address.
 * @type {string}
 */
ui.userinfo.config.NO_EMAIL_TEXT = 'No email address';
