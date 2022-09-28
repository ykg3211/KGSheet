"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDistanceAndIntersect = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getDistanceAndIntersect = function getDistanceAndIntersect(els, shapes) {
  var _els = _slicedToArray(els, 2),
      el1 = _els[0],
      el2 = _els[1];

  var _shapes = _slicedToArray(shapes, 2),
      shape1 = _shapes[0],
      shape2 = _shapes[1];

  var _ref = [el1.getBoundingClientRect(), el2.getBoundingClientRect()],
      rect1 = _ref[0],
      rect2 = _ref[1];

  if (shape1 === shape2) {
    // 两个矩形
    if (shape1 === 'rect') {
      return getDistanceAndIntersectWithRect(rect1, rect2);
    } // 两个圆形


    return getDistanceAndIntersectWithCircle(rect1, rect2);
  } // 矩形和圆形


  if (shape1 === 'rect') {
    return getDistanceAndIntersectWithRectCircle(rect1, rect2);
  } // 圆形和矩形


  return getDistanceAndIntersectWithRectCircle(rect2, rect1);
};

exports.getDistanceAndIntersect = getDistanceAndIntersect;

var getDistanceAndIntersectWithRect = function getDistanceAndIntersectWithRect(rect1, rect2) {
  var radiusXDistance = Math.abs(rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2));
  var halfWidth = (rect1.width + rect2.width) / 2;
  var radiusYDistance = Math.abs(rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2));
  var halfHeight = (rect1.height + rect2.height) / 2;

  if (radiusXDistance < halfWidth && radiusYDistance < halfHeight) {
    return [-1, true];
  }

  var xDistance = radiusXDistance - halfWidth;
  var yDistance = radiusYDistance - halfHeight;
  var cornerDistance = Math.sqrt(Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2));
  var distance = Math.min(cornerDistance, xDistance < 0 ? Infinity : xDistance, yDistance < 0 ? Infinity : yDistance);
  return [distance, false];
};

var getDistanceAndIntersectWithCircle = function getDistanceAndIntersectWithCircle(rect1, rect2) {
  var radius1 = rect1.width / 2;
  var radius2 = rect2.width / 2;
  var centerLeft1 = rect1.left + radius1 / 2;
  var centerLeft2 = rect2.left + radius2 / 2;
  var centerTop1 = rect1.top + radius1 / 2;
  var centerTop2 = rect2.top + radius2 / 2;
  var centerDistance = Math.sqrt(Math.pow(Math.abs(centerLeft1 - centerLeft2), 2) + Math.pow(Math.abs(centerTop1 - centerTop2), 2));

  if (centerDistance < radius1 + radius2) {
    return [-1, true];
  }

  return [centerDistance - radius1 - radius2, false];
}; // 具体算法见 https://www.zhihu.com/question/24251545


var dot = function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
};

var getDistanceAndIntersectWithRectCircle = function getDistanceAndIntersectWithRectCircle(rect, arch) {
  var archRadius = arch.width / 2;
  var radiusXDistance = Math.abs(rect.left + rect.width / 2 - (arch.left + arch.width / 2));
  var radiusYDistance = Math.abs(rect.top + rect.height / 2 - (arch.top + arch.height / 2));
  var verctorH = {
    x: rect.width / 2,
    y: rect.height / 2
  };
  var verctorV = {
    x: radiusXDistance,
    y: radiusYDistance
  };
  var verctorU = {
    x: Math.max(verctorV.x - verctorH.x, 0),
    y: Math.max(verctorV.y - verctorH.y, 0)
  };

  if (dot(verctorU, verctorU) < Math.pow(archRadius, 2)) {
    return [-1, true];
  }

  var verctorD = {
    x: Math.max(verctorV.x - verctorH.x - archRadius, 0),
    y: Math.max(verctorV.y - verctorH.y - archRadius, 0)
  };
  var distance = Math.sqrt(dot(verctorD, verctorD));
  return [distance, false];
};