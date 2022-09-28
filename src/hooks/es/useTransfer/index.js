function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useMemo, useCallback } from 'react';

var useTransfer = function useTransfer(dataSource) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$defaultTarge = options.defaultTargetKeys,
      defaultTargetKeys = _options$defaultTarge === void 0 ? [] : _options$defaultTarge,
      _options$defaultSelec = options.defaultSelectedKeys,
      defaultSelectedKeys = _options$defaultSelec === void 0 ? [] : _options$defaultSelec,
      _options$defaultDisab = options.defaultDisabled,
      defaultDisabled = _options$defaultDisab === void 0 ? false : _options$defaultDisab,
      _options$deafultShowS = options.deafultShowSearch,
      deafultShowSearch = _options$deafultShowS === void 0 ? false : _options$deafultShowS;

  var _useState = useState(defaultTargetKeys),
      _useState2 = _slicedToArray(_useState, 2),
      targetKeys = _useState2[0],
      setTargetKeys = _useState2[1];

  var _useState3 = useState(defaultSelectedKeys),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedKeys = _useState4[0],
      setSelectedKeys = _useState4[1];

  var _useState5 = useState(defaultDisabled),
      _useState6 = _slicedToArray(_useState5, 2),
      disabled = _useState6[0],
      setDisabled = _useState6[1];

  var _useState7 = useState(deafultShowSearch),
      _useState8 = _slicedToArray(_useState7, 2),
      showSearch = _useState8[0],
      setShowSearch = _useState8[1];

  var noTargetKeys = useMemo(function () {
    return dataSource.filter(function (d) {
      return !targetKeys.includes(d.key);
    }).map(function (d) {
      return d.key;
    });
  }, [dataSource, targetKeys]);
  var unSelectedKeys = useMemo(function () {
    return dataSource.filter(function (d) {
      return !selectedKeys.includes(d.key);
    }).map(function (d) {
      return d.key;
    });
  }, [dataSource, selectedKeys]);

  var _useMemo = useMemo(function () {
    var leftAll = function leftAll() {
      setTargetKeys([]);
    };

    var unSelectAll = function unSelectAll() {
      setSelectedKeys([]);
    };

    return {
      leftAll: leftAll,
      unSelectAll: unSelectAll
    };
  }, []),
      leftAll = _useMemo.leftAll,
      unSelectAll = _useMemo.unSelectAll;

  var _useMemo2 = useMemo(function () {
    var rightAll = function rightAll() {
      setTargetKeys(dataSource.map(function (d) {
        return d.key;
      }));
    };

    var selectAll = function selectAll() {
      setSelectedKeys(dataSource.map(function (d) {
        return d.key;
      }));
    };

    return {
      rightAll: rightAll,
      selectAll: selectAll
    };
  }, []),
      rightAll = _useMemo2.rightAll,
      selectAll = _useMemo2.selectAll;

  var handleChange = useCallback(function (nextTargetKeys, direction, moveKeys) {
    setTargetKeys(nextTargetKeys);

    if (options.onChange) {
      options.onChange(nextTargetKeys, direction, moveKeys);
    }
  }, [options.onChange]);
  var handleSelectChange = useCallback(function (sourceSelectedKeys, targetSelectedKeys) {
    setSelectedKeys([].concat(_toConsumableArray(sourceSelectedKeys), _toConsumableArray(targetSelectedKeys)));
  }, []);
  return {
    transferProps: {
      dataSource: dataSource,
      targetKeys: targetKeys,
      selectedKeys: selectedKeys,
      disabled: disabled,
      filterOption: function filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      showSearch: showSearch,
      onChange: handleChange,
      onSelectChange: handleSelectChange
    },
    noTargetKeys: noTargetKeys,
    unSelectedKeys: unSelectedKeys,
    setTargetKeys: setTargetKeys,
    setSelectedKeys: setSelectedKeys,
    setDisabled: setDisabled,
    setShowSearch: setShowSearch,
    leftAll: leftAll,
    rightAll: rightAll,
    selectAll: selectAll,
    unSelectAll: unSelectAll
  };
};

export default useTransfer;