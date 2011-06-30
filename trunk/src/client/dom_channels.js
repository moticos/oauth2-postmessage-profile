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
 * This cross-domain client-side message delivery library supports
 * point-to-point communications. It is actually a wrapper around
 * gadgets.rpc from the Shindig project, which in turn is a wrapper
 * around window.postMessage in modern browsers.
 */
dom.channels = dom.channels || {};

/**
 * Context object for channel handlers. If the "callback" property
 * is present, it is a return value handler and can be invoked
 * (either immediately or in a deferred context) instead of
 * returning a value normally.
 * @typedef {callback: ?function(*)}
 */
dom.channels.CallContext;

/**
 * Message channel handler, invoked in the context of a
 * dom.channels.CallContext object. Channel handlers needing to
 * return a value to the caller should either explicitly invoke
 * the callback method of the context object (possibly in a
 * deferred fashion) and not return a value, or return a value
 * whose type is not 'undefined'.
 * @typedef {function(this: dom.channels.CallContext, ...*): ?*}
 */
dom.channels.Handler;

/**
 * Register a message channel handler.
 * @param {string} channel The channel name.
 * @param {string} frameId The IFRAME name and ID at the other end
 *     of the channel, or '..' for the parent window.
 * @param {dom.channels.Handler} handler The message channel
 *     handler.
 */
dom.channels.setHandler = function(
    channel,
    frameId,
    handler) {
  var rpcToken = gadgets.rpc.getAuthToken(frameId);
  var channelName = String(channel) + ':' + rpcToken;
  if (handler) {
    gadgets.rpc.register(channelName, handler);
  } else {
    gadgets.rpc.unregister(channelName);
  }
};

/**
 * Send a message on a channel.
 * @param {string} channel The channel name.
 * @param {string} frameId The IFRAME name and ID at the other end
 *     of the channel, or '..' for the parent window.
 * @param {?dom.channels.Handler} returnValueHandler An
 *     optional handler function to invoke when (and if) a value
 *     is returned. Leave null if the channel handler at the other
 *     end of the channel will not return a value, as doing
 *     otherwise causes a reference leak.
 * @param {...*} var_args Arguments to be sent to the channel
 *     handler at the other end of the channel.
 */
dom.channels.send = function(
    channel,
    frameId,
    returnValueHandler,
    var_args) {
  var rpcToken = gadgets.rpc.getAuthToken(frameId);
  var channelName = String(channel) + ':' + rpcToken;
  var args = [frameId, channelName, returnValueHandler];
  for (var i = 3, maxI = arguments.length; i < maxI; ++i) {
    args.push(arguments[i]);
  }
  gadgets.rpc.call.apply(gadgets.rpc, args);
};

/**
 * Set up an IFRAME for use with dom.channels. The iframe must
 * already exist in the DOM and point to the correct URL.
 * @param {string} frameId The IFRAME name and ID.
 */
dom.channels.setupFrame = function(frameId) {
  gadgets.rpc.setupReceiver(frameId);
};
