function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _empty() {}

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function makeError() {
  return new DOMException('The request is not allowed', 'NotAllowedError');
}

var clipboardCopy = _async(function (text) {
  return _catch(function () {
    return _awaitIgnored(copyClipboardApi(text));
  }, function (err) {
    // ...Otherwise, use document.execCommand() fallback
    return _catch(function () {
      return _awaitIgnored(copyExecCommand(text));
    }, function (err2) {
      throw err2 || err || makeError();
    });
  });
});

var copyExecCommand = _async(function (text) {
  // Put the text to copy into a <span>
  var span = document.createElement('span');
  span.textContent = text; // Preserve consecutive spaces and newlines

  span.style.whiteSpace = 'pre';
  span.style.webkitUserSelect = 'auto';
  span.style.userSelect = 'all'; // Add the <span> to the page

  document.body.appendChild(span); // Make a selection object representing the range of text selected by the user

  var selection = window.getSelection();
  var range = window.document.createRange();
  selection.removeAllRanges();
  range.selectNode(span);
  selection.addRange(range); // Copy text to the clipboard

  var success = false;

  try {
    success = window.document.execCommand('copy');
  } finally {
    // Cleanup
    selection.removeAllRanges();
    window.document.body.removeChild(span);
  }

  if (!success) throw makeError();
  return _await();
});

var copyClipboardApi = _async(function (text) {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (!navigator.clipboard) {
    throw makeError();
  }

  return navigator.clipboard.writeText(text);
});

export default clipboardCopy;