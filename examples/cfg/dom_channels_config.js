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

if (typeof(dom) == 'undefined') {
  dom = {};
}

/**
 * Cross-domain client-side message delivery library supporting only
 * point-to-point communications.
 */
dom.channels = dom.channels || {};

/** Configuration for cross-domain client-side message delivery library. */
dom.channels.config = dom.channels.config || {};

/**
 * URL parameter name to force origin verification.
 * @type {string}
 */
dom.channels.config.FORCE_SECURE_PARAM = 'forcesecure';

/**
 * URL parameter value to force origin verification.
 * @type {string}
 */
dom.channels.config.FORCE_SECURE_PARAM_VALUE = '1';

/**
 * URL parameter name for channel security token.
 * @type {string}
 */
dom.channels.config.RPC_TOKEN_PARAM = 'rpctoken';

/**
 * URL parameter name for parent URL origin.
 * @type {string}
 */
dom.channels.config.PARENT_ORIGIN_PARAM = 'parent';
