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

/** Configuration for postMessage relay (a.k.a. "proxy") IFRAME. */
oauth2.relay.config = oauth2.relay.config || {};

/**
 * DOM channel name for OAuth 2 result returns.
 * @type {string}
 */
oauth2.relay.config.CALLBACK_CHANNEL = 'oauth2callback';

/**
 * DOM channel name for the ready signal.
 * @type {string}
 */
oauth2.relay.config.PROXY_READY_CHANNEL = 'oauth2relayReady';

/**
 * URL for the hidden postMessage relay (a.k.a. "proxy") IFRAME.
 * @type {string}
 */
oauth2.relay.config.PROXY_URL = oauth2.core.config.IDP + 'postmessageRelay';

/**
 * DOM channel token to prevent spoofing.
 * @type {string}
 */
oauth2.relay.config.RPC_TOKEN = String(shindig.random());
