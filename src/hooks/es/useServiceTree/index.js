function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import useCloudJwt from '../useCloudJwt';
import useMultiSelect from '../useMultiSelect';
var API_PREFIX = 'https://galaxy-api.bytedance.net/service_meta/api/v2/nodes';

var useServiceTree = function useServiceTree() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var jwtToken = options.jwtToken;
  var dataMapRef = useRef(new Map());

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      treeData = _useState2[0],
      setTreeData = _useState2[1];

  var _useCloudJwt = useCloudJwt(jwtToken),
      _useCloudJwt2 = _slicedToArray(_useCloudJwt, 1),
      token = _useCloudJwt2[0];

  var treeIdKeys = useMemo(function () {
    return Array.from(dataMapRef.current.keys()).map(String);
  }, [dataMapRef.current]);
  var checkedSelect = useMultiSelect(treeIdKeys);
  var selectedSelect = useMultiSelect(treeIdKeys);
  var expandedSelect = useMultiSelect(treeIdKeys);
  var fetchWithJwt = useCallback(_async(function (url) {
    var options = {
      headers: {
        'X-Jwt-Token': token
      },
      method: 'GET'
    };
    return _await(fetch(url, options), function (res) {
      return res.json();
    });
  }), [token]);
  useEffect(function () {
    fetchWithJwt("".concat(API_PREFIX, "/root/children?max_level=1")).then(function (res) {
      var data = res.data.slice(1);
      data.forEach(function (d) {
        dataMapRef.current.set(d.id, d);
      });
      setTreeData(data);
    });
  }, []);

  var loadData = _async(function (parentData) {
    fetchWithJwt("".concat(API_PREFIX, "/").concat(parentData.id, "/children?max_level=1")).then(function (res) {
      var data = res.data.slice(1);
      data.forEach(function (d) {
        dataMapRef.current.set(d.id, d);
      });
      dataMapRef.current.get(parentData.id).children = data;
      setTreeData(function (treeData) {
        return _toConsumableArray(treeData);
      });
    });
    return _await();
  });

  return {
    data: treeData,
    loadData: loadData,
    checkedProps: {
      checkable: true,
      checkedKeys: checkedSelect.selected,
      onCheck: checkedSelect.setSelected,
      utils: checkedSelect
    },
    selectedProps: {
      selectable: true,
      selectedKeys: selectedSelect.selected,
      onSelect: selectedSelect.setSelected,
      utils: selectedSelect
    },
    expandedProps: {
      expandedKeys: expandedSelect.selected,
      onExpand: expandedSelect.setSelected,
      utils: expandedSelect
    }
  };
};

export default useServiceTree;