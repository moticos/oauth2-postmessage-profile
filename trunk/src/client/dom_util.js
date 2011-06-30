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

/** HTML/XHTML DOM utility methods. */
dom.util = dom.util || {};

(function() {
  var XHTML_NS = 'http://www.w3.org/1999/xhtml';

  /**
   * Returns document.body or its moral equivalent.
   * @return {Element} The HTML BODY element, XHTML body element, or
   *     document.body.
   */
  dom.util.getBodyElement = function() {
    var body = document.body;
    if (!body) {
      try {
        var xbodies = document.getElementsByTagNameNS(XHTML_NS, 'body');
        if (xbodies && (xbodies.length > 0)) {
          body = xbodies[0];
        }
      } catch (noXhtmlException) {
      }
    }
    return body || document.documentElement || document;
  };

  /**
   * Constructs and returns an HTML or XHTML element with the given
   * tag name.
   * @param {string} tagName The element name. Should be entirely lower case.
   * @return {Element} The newly constructed element.
   */
  dom.util.createHtmlElement = function(tagName) {
    return (document.body && !document.body.namespaceURI) ?
        document.createElement(tagName) :
        document.createElementNS(XHTML_NS, tagName);
  };

  /**
   * Attach an event listener to a DOM object.
   * @param {string|Element|Window} elementOrId The DOM object
   *     (Element or Window) to which to attach the listener, or an
   *     element ID.
   * @param {string} event The event name to listen for. Should be
   *     entirely lower case and should not include the 'on' prefix.
   * @param {function(...*): *} The event listener.
   * @return {Element|Window} The element to which the listener was
   *     attached.
   */
  dom.util.addListener = function(elementOrId, event, handler) {
    var element = elementOrId;
    if (typeof(elementOrId) == 'string') {
      element = document.getElementById(elementOrId);
    }
    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else {
      element.attachEvent('on' + event, handler);
    }
    return element;
  };

  /**
   * Constructs an IFRAME, appends it to the document body, and
   * returns it.
   * @param {?string} location The initial URL for the IFRAME.
   * @param {?string} name The name and ID for the IFRAME.
   * @return {Element} The newly constructed and inserted IFRAME.
   */
  dom.util.openFrame = function(location, name) {
    var frame = dom.util.createHtmlElement('iframe');
    if (name) {
      try {
        var frameIe = dom.util.createHtmlElement(
            '<iframe' +
            ' name="' + dom.util.escapeHtmlAttribute(name) + '"' +
            ' id="' + dom.util.escapeHtmlAttribute(name) + '">' +
            '</iframe>');
        if (frameIe &&
            (frameIe.tagName == frame.tagName) &&
            (frameIe.namespaceURI == frame.namespaceURI) &&
            (frameIe.name == name)) {
          frame = frameIe;
        }
      } catch (notIe) {
      }
      frame.id = name;
      frame.name = name;
    }
    if (location) {
      frame.src = location;
    }
    dom.util.getBodyElement().appendChild(frame);
    if (location) {
      window.frames[name].location = location;
    }
    return frame;
  };

  /**
   * Constructs a hidden IFRAME, appends it to the document body,
   * and returns it.
   * @param {?string} location The initial URL for the IFRAME.
   * @param {?string} name The name and ID for the IFRAME.
   * @return {Element} The newly constructed and inserted IFRAME.
   */
  dom.util.openHiddenFrame = function(location, name) {
    var frame = dom.util.openFrame(location, name);
    frame.style.position = 'absolute';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.visibility = 'hidden';
    frame.style.left = '-1000px';
    frame.style.top = '-1000px';
    frame.height = '0';
    frame.width = '0';
    frame.frameborder = '0';
    frame.scrolling = 'no';
    frame.marginHeight = '0';
    frame.marginWidth = '0';
    return frame;
  };

  /**
   * Remove an element with the given ID from the document if such
   * an element exists.
   * @param {string} id The element ID.
   */
  dom.util.removeElementById = function(id) {
    var element = document.getElementById(id);
    if (element) {
      element.parentNode.removeChild(element);
    }
  };

  /**
   * Quote a string for use in an HTML or XHTML attribute value.
   * @param {*} value The value to be quoted. Will be stringified.
   * @return {string} The quoted value.
   */
  dom.util.escapeHtmlAttribute = function(value) {
    return (String(value).
            split('&').
            join('&amp;').
            split('"').
            join('&quot;').
            split('\'').
            join('&#39;').
            split('<').
            join('&lt;').
            split('>').
            join('&gt;'));
  };

  /**
   * Computes and returns the origin portion of a URL, or the window
   * location if no URL is given.
   * @param {?string} opt_url The URL to compute the origin of; leave
   *     null or omit to compute the origin of the window location.
   * @return {string} The origin.
   */
  dom.util.getOrigin = function(opt_url) {
    var url = (opt_url == null) ? location.href : opt_url;
    return gadgets.rpc.getOrigin(String(url));
  };

})();
