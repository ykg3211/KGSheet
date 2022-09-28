function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useEffect } from 'react';

var useScript = function useScript(src, properties) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadedState = _useState2[0],
      setLoadedState = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      errorState = _useState4[0],
      setErrorState = _useState4[1];

  useEffect(function () {
    if (!src && !(properties && properties.innerHTML)) return;
    var scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';

    if (src) {
      scriptEl.src = src;
    }

    if (properties) {
      Object.keys(properties).forEach(function (key) {
        // @ts-ignore
        scriptEl[key] = properties[key];
      });
    }

    var handleScriptLoad = function handleScriptLoad() {
      setLoadedState(true);
    };

    var handleScriptError = function handleScriptError(error) {
      setErrorState(error);
    };

    scriptEl.addEventListener('load', handleScriptLoad);
    scriptEl.addEventListener('error', handleScriptError);
    document.body.appendChild(scriptEl); // @ts-ignore

    return function () {
      scriptEl.removeEventListener('load', handleScriptLoad);
      scriptEl.removeEventListener('error', handleScriptError);
    };
  }, [src, properties && properties.innerHTML]);
  return [loadedState, errorState];
};

export default useScript;