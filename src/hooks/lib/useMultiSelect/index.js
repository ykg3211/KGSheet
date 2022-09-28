"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMultiSelect;

var _react = require("react");

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

function useMultiSelect(items) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$isMulti = options.isMulti,
      isMulti = _options$isMulti === void 0 ? true : _options$isMulti,
      defaultSelected = options.defaultSelected,
      dataKey = options.dataKey;

  var _useState = (0, _react.useState)(defaultSelected || []),
      _useState2 = _slicedToArray(_useState, 2),
      selected = _useState2[0],
      setSelected = _useState2[1];

  var availableItems = (0, _react.useMemo)(function () {
    return items.filter(function (o) {
      return !o.disabled;
    });
  }, [items]);

  var getSelectedKey = function getSelectedKey(selected) {
    if (!dataKey) return selected;
    if (typeof dataKey === 'function') return dataKey(selected);
    return selected[dataKey];
  };

  var selectedSet = (0, _react.useMemo)(function () {
    return new Set(selected.map(getSelectedKey));
  }, []);

  var _useMemo = (0, _react.useMemo)(function () {
    var isSelected = function isSelected(item) {
      return selectedSet.has(getSelectedKey(item));
    };

    var select = isMulti ? function (item) {
      selectedSet.add(getSelectedKey(item));
      return setSelected(function (selected) {
        return [].concat(_toConsumableArray(selected), [item]);
      });
    } : function (item) {
      selectedSet.clear();
      selectedSet.add(getSelectedKey(item));
      return setSelected(function () {
        return [item];
      });
    };

    var unSelect = function unSelect(item) {
      var uniqKey = getSelectedKey(item);
      selectedSet.delete(uniqKey);
      return setSelected(function (selected) {
        return selected.filter(function (s) {
          return getSelectedKey(s) !== uniqKey;
        });
      });
    };

    var toggle = function toggle(item) {
      if (isSelected(item)) {
        unSelect(item);
      } else {
        select(item);
      }
    };

    return {
      isSelected: isSelected,
      select: select,
      unSelect: unSelect,
      toggle: toggle
    };
  }, [selectedSet, isMulti]),
      isSelected = _useMemo.isSelected,
      select = _useMemo.select,
      unSelect = _useMemo.unSelect,
      toggle = _useMemo.toggle;

  var _useMemo2 = (0, _react.useMemo)(function () {
    var selectAll = function selectAll() {
      availableItems.forEach(function (item) {
        selectedSet.add(getSelectedKey(item));
      });
      setSelected(_toConsumableArray(availableItems));
    };

    var unSelectAll = function unSelectAll() {
      selectedSet.clear();
      setSelected([]);
    };

    var setMultiSelected = function setMultiSelected(availableItems) {
      selectedSet.clear();
      availableItems.forEach(function (item) {
        selectedSet.add(getSelectedKey(item));
      });
      setSelected(_toConsumableArray(availableItems));
    };

    return {
      selectAll: selectAll,
      unSelectAll: unSelectAll,
      setMultiSelected: setMultiSelected
    };
  }, [selectedSet, availableItems]),
      selectAll = _useMemo2.selectAll,
      unSelectAll = _useMemo2.unSelectAll,
      setMultiSelected = _useMemo2.setMultiSelected;

  var noneSelected = Array.from(selectedSet).length === 0;
  var allSelected = !noneSelected && Array.from(selectedSet).length === availableItems.length;
  var partiallySelected = !noneSelected && !allSelected;
  var toggleAll = (0, _react.useCallback)(function () {
    return allSelected ? unSelectAll() : selectAll();
  }, [allSelected, unSelectAll, selectAll]);
  return {
    selected: selected,
    isSelected: isSelected,
    select: select,
    unSelect: unSelect,
    toggle: toggle,
    selectAll: selectAll,
    unSelectAll: unSelectAll,
    toggleAll: toggleAll,
    allSelected: allSelected,
    noneSelected: noneSelected,
    partiallySelected: partiallySelected,
    setSelected: setMultiSelected,
    setMultiSelected: setMultiSelected
  };
}