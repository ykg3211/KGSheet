function _empty() {}

function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}

function _callIgnored(body, direct) {
  return _call(body, _empty, direct);
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useEffect, useCallback, useRef } from 'react';

var fetchJwt = _async(function () {
  return _await(fetch(JWT_URL, {
    mode: 'cors',
    credentials: 'include'
  }), function (res) {
    var token = res.headers.get('X-Jwt-Token');
    return token ? token : _invoke(function () {
      if (res.status === 401) {
        return _callIgnored(redirectToSso);
      }
    }, function () {
      return '';
    });
  });
});

export var JWT_KEY = '__byted_hook_jwt';
export var JWT_URL = 'https://cloud.bytedance.net/auth/api/v1/jwt';

// 访问 ref.current 可检查组件是否处在挂载中
function useMounting() {
  var ref = useRef(true);
  useEffect(function () {
    ref.current = true;
    return function () {
      ref.current = false;
    };
  }, []);
  return ref;
}

var useCloudJwt = function useCloudJwt() {
  var initToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var useInitToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _useState = useState(initToken),
      _useState2 = _slicedToArray(_useState, 2),
      token = _useState2[0],
      setToken = _useState2[1];

  var mounting = useMounting();
  var refreshJwt = useCallback(function () {
    fetchJwt().then(function (token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(JWT_KEY, token);
      }

      if (mounting.current) {
        setToken(token);
      }
    });
  }, []);
  useEffect(function () {
    // 优先使用传入的 token
    if (initToken) {
      setToken(initToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem(JWT_KEY, initToken);
      }
    } else {
      // 不存在传入的 token 时，尝试使用 localStorage 中的 token
      if (checkJwt()) {
        if (typeof window !== 'undefined') {
          setToken(localStorage.getItem(JWT_KEY) || '');
        }
      } else if (!useInitToken) {
        // 如果没有强制要求使用传入的 token，则发起网络请求
        refreshJwt();
      }
    }
  }, [initToken, useInitToken]);
  return [token, setToken, {
    refreshJwt: refreshJwt,
    fetchJwt: fetchJwt,
    parseJwt: parseJwt,
    checkJwt: checkJwt
  }];
};
/**
 * 检查 JWT 是否有效
 */


function checkJwt() {
  var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (typeof window === 'undefined') return false;
  var jwt = token || localStorage.getItem(JWT_KEY);
  if (!jwt) return false;
  var parsed = parseJwt(jwt);
  if (!parsed) return false;
  return parsed.exp > Date.now() / 1000;
}

export function parseJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var info = JSON.parse(atob(base64)); // 中文在浏览器转码需要如下额外操作
    // FYI: https://blog.sqrtthree.com/articles/utf8-to-b64/

    info.organization = decodeURIComponent(escape(info.organization));
    return info;
  } catch (err) {
    /* eslint-disable no-console */
    console.error('jwt parse error', err);
    return undefined;
  }
}
/**
 * 跳转到 CAS SSO
 * 因此返回一个不会 resolve 的 Promise,
 * 以达到阻塞效果
 */

function redirectToSso() {
  /* eslint-disable no-restricted-globals */
  var currentUrl = location.href;
  var encodeUrl = encodeURIComponent("https://cloud.bytedance.net/auth/api/v1/login?next=".concat(encodeURIComponent(currentUrl)));
  location.href = "//sso.bytedance.com/cas/login?service=".concat(encodeUrl);
  return new Promise(function () {});
}

export default useCloudJwt;