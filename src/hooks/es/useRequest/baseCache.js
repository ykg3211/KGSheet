function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseCache = function BaseCache() {
  var _this = this;

  _classCallCheck(this, BaseCache);

  this.value = void 0;
  this.type = 'memory';

  this.changeType = function (type) {
    _this.type = type;
  };

  this.getValue = function (key) {
    switch (_this.type) {
      case 'memory':
        {
          return _this.value.get(key);
        }

      case 'localStorage':
        {
          return JSON.parse(localStorage.getItem(key) || '{}');
        }

      default:
        {
          return _this.value.get(key);
        }
    }
  };

  this.setValue = function (key, data) {
    switch (_this.type) {
      case 'memory':
        {
          _this.value.set(key, data);

          break;
        }

      case 'localStorage':
        {
          localStorage.setItem(key, JSON.stringify(data));
          break;
        }

      default:
        {
          _this.value.set(key, data);
        }
    }
  };

  this.removeItem = function (key) {
    switch (_this.type) {
      case 'memory':
        {
          _this.value.delete(key);

          break;
        }

      case 'localStorage':
        {
          localStorage.removeItem(key);
          break;
        }

      default:
        {
          _this.value.delete(key);
        }
    }
  };

  this.value = new Map();
};

export default BaseCache;