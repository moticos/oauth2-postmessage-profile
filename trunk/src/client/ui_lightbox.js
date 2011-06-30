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

/**
 * Manages a simple modal dialog with shadows behind it (a.k.a. a
 * "lightbox") with two labeled control buttons (OK and Cancel), an
 * extra corner 'x' button to cancel it, title text, and description
 * text.
 */
ui.lightbox = ui.lightbox || {};

(function() {

    var imports = {
      createHtmlElement: dom.util.createHtmlElement,
      addListener: dom.util.addListener,
      getBodyElement: dom.util.getBodyElement,
      openFrame: dom.util.openFrame,
      removeElementById: dom.util.removeElementById
    };

    /**
     * Creates a lightboxed dialog and append it to the document body.
     * @param {string} id ID for the outermost element of the newly
     *     created dialog. Can later be passed to
     *     dom.util.removeElementById to close the dialog.
     * @param {string} titleText Text to display in the dialog title
     *     area.
     * @param {string} descriptionText Text to display in the
     *     description area.
     * @param {string} okButtonText Label for the "OK" button.
     * @param {string} cancelButtonText Label for the "Cancel" button.
     * @param {Function} cancelButtonClickHandler Handler for the
     *     "Cancel" button, the extra corner "x" cancel button, or
     *     clicking the shadows behind the dialog.
     * @param {Function} okButtonClickHandler Handler for the "OK" button.
     * @return {Element} Returns a reference to the "OK" button
     *     element so that the caller can focus it.
     */
    ui.lightbox.open = function(
        id,
        titleText,
        descriptionText,
        okButtonText,
        cancelButtonText,
        cancelButtonClickHandler,
        okButtonClickHandler) {
      var body = imports.getBodyElement();
      var isRtl = body.dir && (body.dir.toLowerCase() == 'rtl');
      var textEndSide = isRtl ? 'left' : 'right';
      imports.removeElementById(id);
      var glass = imports.createHtmlElement('div');
      glass.id = id;
      glass.style.margin = '0';
      glass.style.border = 'none';
      glass.style.padding = '0';
      glass.style.zIndex = '32767';
      glass.style.background = 'transparent';
      glass.style.position = 'fixed';
      glass.style.bottom = '0';
      glass.style.left = '0';
      glass.style.width = '100%';
      glass.style.height = '100%';
      glass.style.textAlign = 'center';
      glass.style.overflow = '';
      glass.style.boxShadow =
      glass.style.MozBoxShadow =
      glass.style.WebkitBoxShadow = 'inset 0 0 28px #777';
      glass.tabIndex = '-1';
      var glassFrameHolder = imports.createHtmlElement('div');
      glassFrameHolder.style.position = 'absolute';
      glassFrameHolder.style.top = '0';
      glassFrameHolder.style.left = '0';
      glassFrameHolder.style.bottom = '0';
      glassFrameHolder.style.right = '0';
      glassFrameHolder.style.float = 'right';
      var glassFrame = imports.openFrame(null, id + '-frame');
      glassFrame.tabIndex = '-1';
      glassFrame.width = '100%';
      glassFrame.height = '100%';
      glassFrame.frameBorder = '0';
      glassFrame.style.position = 'absolute';
      glassFrame.style.background = '#888';
      glassFrame.style.border = 'none';
      glassFrame.style.zIndex = '32766';
      glassFrame.scrolling = 'no';
      if (typeof(glassFrame.style.opacity) == 'undefined') {
        glassFrame.style.filter = 'alpha(opacity=50)';
      }
      glassFrame.style.opacity = '0.5';
      glassFrame.style.position = 'fixed';
      glassFrame.style.top = '0';
      glassFrame.style.left = '0';
      glassFrame.style.width = '100%';
      glassFrame.style.margin = '0';
      glassFrame.style.padding = '0';
      glassFrameHolder.appendChild(glassFrame);
      glass.appendChild(glassFrameHolder);
      var shim = imports.createHtmlElement('table');
      shim.style.position = 'fixed';
      shim.style.zIndex = '32767';
      shim.border = '0';
      shim.width = '100%';
      shim.height = '100%';
      shim.style.padding = '0';
      shim.style.top = '0';
      shim.style.left = '0';
      shim.style.right = '0';
      shim.style.bottom = '0';
      shim.style.margin = '0';
      shim.style.border = 'none';
      shim.style.verticalAlign = 'middle';
      shim.style.width = '100%';
      shim.style.height = '100%';
      shim.style.maxHeight = '100%';
      shim.style.maxWidth = '100%';
      shim.style.overflow = 'auto';
      shim.appendChild(imports.createHtmlElement('thead'));
      var shimBody = imports.createHtmlElement('tbody');
      var shimRow = imports.createHtmlElement('tr');
      shimRow.border = '0';
      shimRow.cellPadding = '0';
      shimRow.cellSpacing = '0';
      shimRow.style.padding = '0';
      shimRow.style.margin = '0';
      shimRow.style.border = 'none';
      var shimCol = imports.createHtmlElement('td');
      shimCol.border = '0';
      shimCol.cellPadding = '0';
      shimCol.cellSpacing = '0';
      shimCol.vAlign = 'middle';
      shimCol.style.padding = '0';
      shimCol.style.margin = '0';
      shimCol.style.border = 'none';
      shimCol.style.verticalAlign = 'middle';
      shimCol.style.background = 'transparent';
      var glassButton = imports.createHtmlElement('button');
      glassButton.style.background = 'transparent';
      glassButton.style.margin = '0';
      glassButton.style.padding = '0';
      glassButton.style.zIndex = '32767';
      glassButton.style.position = 'fixed';
      glassButton.style.top = '0';
      glassButton.style.bottom = '0';
      glassButton.style.left = '0';
      glassButton.style.width = '100%';
      glassButton.style.height = '100%';
      glassButton.style.border = 'none';
      imports.addListener(glassButton, 'click', cancelButtonClickHandler);
      shimCol.appendChild(glassButton);
      var lightbox = imports.createHtmlElement('div');
      lightbox.style.display = 'inline-block';
      lightbox.style.background = 'white';
      lightbox.style.color = 'black';
      lightbox.style.border = '1px solid #eee';
      lightbox.style.borderRadius =
      lightbox.style.MozBorderRadius =
      lightbox.style.WebkitBorderRadius = '5px';
      lightbox.style.position = 'relative';
      lightbox.style.zIndex = '32767';
      lightbox.style.padding = '0';
      lightbox.style.margin = '10%';
      lightbox.style.boxShadow =
      lightbox.style.MozBoxShadow =
      lightbox.style.WebkitBoxShadow = '5px 10px 28px 5px #777';
      lightbox.style.maxHeight = '80%';
      lightbox.style.minHeight = '80px';
      lightbox.style.overflow = 'visible';
      lightbox.style.textAlign = 'center';
      var extraCloseButton = imports.addListener(
          imports.createHtmlElement('button'),
          'click',
          cancelButtonClickHandler);
      extraCloseButton.appendChild(document.createTextNode('x'));
      extraCloseButton.style.fontFamily = 'droid sans, arial, sans-serif';
      extraCloseButton.style.border = 'none';
      extraCloseButton.style.background = '#777';
      extraCloseButton.style.color = 'white';
      extraCloseButton.style.fontSize = '10px';
      extraCloseButton.style.fontWeight = 'bold';
      extraCloseButton.style.lineHeight = '10px';
      extraCloseButton.style.height = '16px';
      extraCloseButton.style.width = '16px';
      extraCloseButton.style.borderRadius =
      extraCloseButton.style.MozBorderRadius =
      extraCloseButton.style.WebkitBorderRadius = '8px';
      extraCloseButton.style.position = 'absolute';
      extraCloseButton.style.top = '-8px';
      extraCloseButton.style[textEndSide] = '-8px';
      extraCloseButton.style.verticalAlign = '50%';
      extraCloseButton.style.textAlign = 'center';
      extraCloseButton.style.margin = '0';
      extraCloseButton.style.padding = '1px';
      extraCloseButton.title = cancelButtonText;
      lightbox.appendChild(extraCloseButton);
      var contentArea = imports.createHtmlElement('div');
      contentArea.style.position = 'relative';
      contentArea.style.overflow = 'auto';
      contentArea.style.maxHeight = '100%';
      contentArea.style.minHeight = '80px';
      contentArea.style.margin = 'auto';
      contentArea.style.padding = '0 10px 0';
      var title = imports.createHtmlElement('h4');
      title.appendChild(document.createTextNode(titleText));
      contentArea.appendChild(title);
      var description = imports.createHtmlElement('div');
      description.appendChild(document.createTextNode(descriptionText));
      contentArea.appendChild(description);
      var okButton = imports.addListener(
          imports.createHtmlElement('button'),
          'click',
          okButtonClickHandler);
      okButton.appendChild(
          document.createTextNode(okButtonText));
      okButton.style.margin = '1em';
      contentArea.appendChild(okButton);
      var cancelButton = imports.addListener(
          imports.createHtmlElement('button'),
          'click',
          cancelButtonClickHandler);
      cancelButton.appendChild(document.createTextNode(cancelButtonText));
      cancelButton.style.margin = '1em';
      contentArea.appendChild(cancelButton);
      lightbox.appendChild(contentArea);
      shimCol.appendChild(lightbox);
      shimRow.appendChild(shimCol);
      shimBody.appendChild(shimRow);
      shim.appendChild(shimBody);
      glass.appendChild(shim);
      if (typeof(shim.style.boxShadow) == 'undefined') {
        shim.style.filter =
            'shadow(direction=117, strength=15, Color=#999999)';
      }
      body.appendChild(glass);
      try {
        frames[glassFrame.name].location.replace(
            'javascript:\'<body style="background:#888" />\'');
      } catch (notIe) {
      }
      return okButton;
    };

  })();
