"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports.post = exports.fromArray = exports.toArray = exports.fromJson = exports.toJson = exports.setValue = exports.getValue = exports.unreadOnlyForm = exports.readOnlyForm = exports.resetForm = exports.clearForm = exports.enableForm = exports.disableForm = exports.isEditable = exports.formEach = exports.formEachElement = exports.default = void 0;

var _locustjsBase = require("locustjs-base");

var _locustjsExtensionsArray = require("locustjs-extensions-array");

var _locustjsExtensionsObject = require("locustjs-extensions-object");

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var formEachElement = function formEachElement() {
  var selector = 'form';
  var callback;
  var hasCallback = false;
  var hasExcludes = false;
  var excludes;
  var forms = null;
  var temp;
  var result = [];

  function _setExcludes(arg) {
    if ((0, _locustjsBase.isFunction)(arg)) {
      excludes = arg;
      hasExcludes = true;
    } else {
      if ((0, _locustjsBase.isSomeString)(arg)) {
        arg = arg.split(',');
      }

      if ((0, _locustjsBase.isArray)(arg)) {
        var classNames = arg.filter(function (x) {
          return x && x[0] == '.';
        });

        excludes = function excludes(frm, el) {
          if ((0, _locustjsExtensionsArray.contains)(arg, el.tagName)) {
            return true;
          }

          var _iterator = _createForOfIteratorHelper(classNames),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var className = _step.value;

              var _iterator2 = _createForOfIteratorHelper(el.classList),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var elClassName = _step2.value;

                  if (elClassName == className.substr(1)) {
                    return true;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return false;
        };

        hasExcludes = true;
      }
    }
  }

  if (arguments.length > 0) {
    temp = arguments[0];

    if ((0, _locustjsBase.isFunction)(temp)) {
      callback = temp;
      hasCallback = true;
    } else if ((0, _locustjsBase.isSomeString)(temp)) {
      selector = temp;
    } else if ((0, _locustjsBase.isArray)(temp)) {
      selector = '';
      forms = temp;
    } else if ((0, _locustjsBase.isSomeObject)(temp)) {
      selector = '';
      forms = [temp];
    }

    if (arguments.length > 1) {
      temp = arguments[1];

      if ((0, _locustjsBase.isFunction)(temp)) {
        if (hasCallback) {
          _setExcludes(temp);
        } else {
          callback = temp;
          hasCallback = true;
        }
      } else if (hasCallback) {
        _setExcludes(temp);
      }

      if (arguments.length > 2) {
        temp = arguments[2];

        _setExcludes(temp);
      }
    }
  }

  if (hasCallback) {
    if (selector) {
      forms = document.querySelectorAll(selector);
    }

    if (!(0, _locustjsBase.isEmpty)(forms) && forms.length) {
      for (var i = 0; i < forms.length; i++) {
        var frm = forms[i];
        var elements = frm && frm.elements;
        var arr = [];

        if ((0, _locustjsBase.isEmpty)(elements) || elements.length == 0) {
          elements = frm.querySelectorAll('input, select, textarea');
        }

        if (!(0, _locustjsBase.isEmpty)(elements) && elements.length) {
          for (var j = 0; j < elements.length; j++) {
            if (!hasExcludes || !excludes(frm, elements[j], j, i)) {
              var r = callback(frm, elements[j], j, i);
              arr.push(r);
            }
          }
        }

        result.push(arr);
      }
    }
  }

  return result;
};

exports.formEachElement = formEachElement;
var NON_DATA_ENTRY_INPUT_TYPES = ['button', 'submit', 'reset', 'image'];
var NON_DATA_ENTRY_TAGS = ['button', 'fieldset', 'legend'];

var isEditable = function isEditable(el) {
  var _type = (el.type || '').toLowerCase();

  var _tag = (el.tagName || '').toLowerCase();

  var result = !(NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 || NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0);
  return result;
};

exports.isEditable = isEditable;

var formEach = function formEach(selector, callback, excludes) {
  if (excludes == null) {
    excludes = function excludes(frm, el) {
      return !isEditable(el);
    };
  }

  return formEachElement(selector, callback, excludes);
};

exports.formEach = formEach;

var disableForm = function disableForm(selector) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return formEachElement(selector, function (frm, el) {
    return el.disabled = value;
  });
};

exports.disableForm = disableForm;

var enableForm = function enableForm(selector) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return formEachElement(selector, function (frm, el) {
    return el.disabled = !value;
  });
};

exports.enableForm = enableForm;

var readOnlyForm = function readOnlyForm(selector) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return formEach(selector, function (frm, el) {
    return el.readOnly = value;
  });
};

exports.readOnlyForm = readOnlyForm;

var unreadOnlyForm = function unreadOnlyForm(selector) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return formEach(selector, function (frm, el) {
    return el.readOnly = !value;
  });
};

exports.unreadOnlyForm = unreadOnlyForm;

var resetForm = function resetForm(selector) {
  return formEachElement(selector, function (frm) {
    return frm.reset();
  });
};

exports.resetForm = resetForm;

var clearForm = function clearForm(selector) {
  return formEach(selector, function (frm, el, i) {
    var type = (el.type || '').toLowerCase();
    var tag = (el.tagName || '').toLowerCase();

    if (type == 'checkbox' || type == 'radio') {
      el.checked = false;
    } else if (type == 'select') {
      if (el.options && el.options.length) {
        var _iterator3 = _createForOfIteratorHelper(el.options),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var opt = _step3.value;
            opt.selected = false;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } else if (type != 'hidden') {
      el.value = '';
    }
  });
};

exports.clearForm = clearForm;

var hasValue = function hasValue(el) {
  var attrs = el.attributes;

  for (var i = 0; i < attrs.length; i++) {
    if (attrs[i].name.toLowerCase() == 'value') {
      return true;
    }
  }

  return false;
};

var _toJson = function toJson(selector, excludes, expandNames) {
  var result = [];
  var checkboxes = [];
  formEach(selector, function (frm, el, i, j) {
    if (result[j] == undefined) {
      result[j] = {};
    }

    var _type = (el.type || '').toLowerCase();

    var _tag = (el.tagName || '').toLowerCase();

    var _name = el.name;
    var _id = el.id;

    var _key = _name || _id;

    if ((0, _locustjsBase.isEmpty)(_key)) {
      _key = i;
    }

    if (_type == 'checkbox') {
      if (!(0, _locustjsBase.isArray)(result[j][_key])) {
        result[j][_key] = [];
      }

      var item = checkboxes.find(function (x) {
        return x.form == j && x.key == _key;
      });

      if (!item) {
        item = {
          form: j,
          key: _key,
          count: 1
        };
        checkboxes.push(item);
      } else {
        item.count++;
      }

      if (el.checked) {
        if (hasValue(el)) {
          result[j][_key].push(el.value);
        } else {
          result[j][_key].push(true);
        }
      } else {
        if (!hasValue(el)) {
          result[j][_key].push(false);
        }
      }
    } else if (_type == 'radio') {
      if (el.checked) {
        if (hasValue(el)) {
          result[j][_key] = el.value;
        } else {
          result[j][_key] = true;
        }
      }
    } else if (_tag == 'select') {
      if (el.multiple) {
        result[j][_key] = [];

        for (var ii = 0; ii < el.selectedOptions.length; ii++) {
          result[j][_key].push(el.selectedOptions[ii].value);
        }
      } else {
        result[j][_key] = el.options[el.selectedIndex].value;
      }
    } else if (_tag == 'button') {
      result[j][_key] = el.innerText;
    } else {
      result[j][_key] = el.value;
    }
  }, excludes);

  if (result.length == 0) {
    return {};
  } else {
    if (checkboxes.length > 0) {
      var _iterator4 = _createForOfIteratorHelper(checkboxes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var item = _step4.value;

          if (item.count == 1) {
            if (result[item.form][item.key].length == 1) {
              result[item.form][item.key] = result[item.form][item.key][0];
            } else {
              result[item.form][item.key] = false;
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

    if (expandNames) {
      result = (0, _locustjsExtensionsObject.expand)(result);
    }

    if (result.length == 1) {
      result = result[0];
    }
  }

  return result;
};

exports.toJson = _toJson;

var _fromJson = function fromJson(selector, obj, excludes, flattenProps) {
  if ((0, _locustjsBase.isSomeObject)(obj) || (0, _locustjsBase.isArray)(obj)) {
    var checkboxes = [];
    formEach(selector, function (frm, el, i, j) {
      var _type = (el.type || '').toLowerCase();

      var _tag = (el.tagName || '').toLowerCase();

      var _name = el.name;
      var _id = el.id;

      var _key = _name || _id;

      if ((0, _locustjsBase.isEmpty)(_key)) {
        _key = i;
      }

      var form = (0, _locustjsBase.isArray)(obj) ? obj[j] : obj;

      if (flattenProps) {
        form = (0, _locustjsExtensionsObject.flatten)(form);
      }

      var value = form && form[_key];

      if (value != null) {
        if ((0, _locustjsBase.isSomeObject)(value) && (0, _locustjsBase.isSomeString)(_key)) {
          var dotIndex = _key.indexOf('.');

          var prevIndex = 0;
          var prevObj = value;

          while (dotIndex >= 0) {
            var subKey = _key.substring(prevIndex, dotIndex);

            if (!prevObj[subKey]) {
              prevObj = null;
              break;
            }

            prevIndex = dotIndex + 1;
            prevObj = prevObj[subKey];
            dotIndex = _key.indexOf('.', dotIndex + 1);
          }

          value = prevObj ? prevObj[_key.substr(prevIndex)] : null;
        }

        if (value != null) {
          if (_type == 'checkbox' || _type == 'radio') {
            var item = checkboxes.find(function (x) {
              return x.form == j && x.key == _key;
            });

            if (!item) {
              item = {
                form: j,
                key: _key,
                count: 1
              };
              checkboxes.push(item);
            } else {
              item.count++;
            }

            if ((0, _locustjsBase.isBool)(value)) {
              el.checked = value;
            } else if ((0, _locustjsBase.isArray)(value)) {
              if (value.length == 1) {
                if (hasValue(el)) {
                  el.checked = el.value == value[0];
                } else {
                  el.checked = value[0];
                }
              } else {
                if (hasValue(el)) {
                  el.checked = value.indexOf(el.value) >= 0;
                } else {
                  el.checked = item.count > 0 && item.count <= value.length && value[item.count - 1];
                }
              }
            } else {
              if (hasValue(el)) {
                el.checked = el.value == value;
              } else {
                el.checked = value;
              }
            }
          } else if (_tag == 'select') {
            if (el.multiple) {
              if ((0, _locustjsBase.isArray)(value)) {
                for (var ii = 0; ii < el.options.length; ii++) {
                  el.options[ii].selected = (0, _locustjsExtensionsArray.contains)(value, el.options[ii].value);
                }
              } else {
                el.selectedIndex = value;
              }
            } else {
              el.selectedIndex = value;
            }
          } else {
            el.value = value;
          }
        }
      }
    }, excludes);
  }
};

exports.fromJson = _fromJson;

var _toArray = function toArray(selector, excludes) {
  var result = [];
  var checkboxes = [];
  formEach(selector, function (frm, el, i, j) {
    if (result[j] == undefined) {
      result[j] = [];
    }

    var _type = (el.type || '').toLowerCase();

    var _tag = (el.tagName || '').toLowerCase();

    var _name = el.name;
    var _id = el.id;

    var _key = _name || _id;

    if ((0, _locustjsBase.isEmpty)(_key)) {
      _key = i;
    }

    if (_type == 'checkbox') {
      var item = checkboxes.find(function (x) {
        return x.form == j && x.key == _key;
      });

      if (!item) {
        item = {
          form: j,
          key: _key,
          count: 1
        };
        checkboxes.push(item);
      } else {
        item.count++;
      }

      var index = -1;
      var arr;

      for (var ii = 0; ii < result[j].length; ii++) {
        if (result[j][ii].name == _key) {
          index = ii;
          break;
        }
      }

      if (index >= 0) {
        arr = result[j][index].value;
      }

      if (el.checked) {
        if (arr) {
          if (hasValue(el)) {
            arr.push(el.value);
          } else {
            arr.push(true);
          }
        } else {
          if (hasValue(el)) {
            result[j].push({
              name: _key,
              value: [el.value]
            });
          } else {
            result[j].push({
              name: _key,
              value: [true]
            });
          }
        }
      }
    } else if (_type == 'radio') {
      if (el.checked) {
        if (hasValue(el)) {
          result[j].push({
            name: _key,
            value: el.value
          });
        } else {
          result[j].push({
            name: _key,
            value: true
          });
        }
      }
    } else if (_tag == 'select') {
      if (el.multiple) {
        var temp = [];

        for (var _ii = 0; _ii < el.selectedOptions.length; _ii++) {
          temp.push(el.selectedOptions[_ii].value);
        }

        result[j].push({
          name: _key,
          value: temp
        });
      } else {
        result[j].push({
          name: _key,
          value: el.options[el.selectedIndex].value
        });
      }
    } else {
      result[j].push({
        name: _key,
        value: el.value
      });
    }
  }, excludes);

  if (result.length == 0) {
    return [];
  } else {
    if (checkboxes.length > 0) {
      var _iterator5 = _createForOfIteratorHelper(checkboxes),
          _step5;

      try {
        var _loop = function _loop() {
          var item = _step5.value;

          if (item.count == 1) {
            var e = result[item.form].find(function (x) {
              return x.name == item.key;
            });

            if (e && e.value.length == 1) {
              e.value = e.value[0];
            }
          }
        };

        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }

    if (result.length == 1) {
      return result[0];
    }
  }

  return result;
};

exports.toArray = _toArray;

var _fromArray = function fromArray(selector, obj, excludes) {
  if ((0, _locustjsBase.isArray)(obj)) {
    var isArrayOfArray = true;

    for (var i = 0; i < obj.length; i++) {
      if (!(0, _locustjsBase.isArray)(obj[i])) {
        isArrayOfArray = false;
        break;
      }
    }

    formEach(selector, function (frm, el, i, j) {
      var _type = (el.type || '').toLowerCase();

      var _tag = (el.tagName || '').toLowerCase();

      var _name = el.name;
      var _id = el.id;

      var _key = _name || _id;

      if ((0, _locustjsBase.isEmpty)(_key)) {
        _key = i;
      }

      var data = isArrayOfArray ? obj[j] : obj;
      var item = data.find(function (x) {
        return x.name == _key;
      });
      var value;

      if (item) {
        value = item.value;
      }

      if (value != null) {
        if (_type == 'checkbox' || _type == 'radio') {
          if ((0, _locustjsBase.isBool)(value)) {
            el.checked = value;
          } else if ((0, _locustjsBase.isArray)(value)) {
            if (value.length == 1) {
              if (hasValue(el)) {
                el.checked = el.value == value[0];
              } else {
                el.checked = value[0];
              }
            } else {
              if (hasValue(el)) {
                el.checked = value.indexOf(el.value) >= 0;
              } else {
                if (_name && frm.querySelectorAll) {
                  var els = frm.querySelectorAll('[name="' + _name + '"]');

                  if (els && els.length) {
                    for (var _i = 0; _i < els.length; _i++) {
                      if (els[_i] == el) {
                        if (value.length > _i) {
                          el.checked = value[_i];
                        }

                        break;
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (hasValue(el)) {
              el.checked = el.value == value;
            } else {
              el.checked = value;
            }
          }
        } else if (_tag == 'select') {
          if (el.multiple) {
            if ((0, _locustjsBase.isArray)(value)) {
              for (var ii = 0; ii < el.options.length; ii++) {
                el.options[ii].selected = (0, _locustjsExtensionsArray.contains)(value, el.options[ii].value);
              }
            } else {
              el.selectedIndex = value;
            }
          } else {
            el.selectedIndex = value;
          }
        } else {
          el.value = value;
        }
      }
    }, excludes);
  }
};

exports.fromArray = _fromArray;

var post = function post() {
  if (arguments.length) {
    var options = {
      action: '',
      enctype: '',
      target: '',
      args: {}
    };
    var frm = document.createElement('FORM');
    frm.method = 'post';

    if ((0, _locustjsBase.isObject)(arguments[0])) {
      options.action = arguments[0].url || arguments[0].action;
      options.args = arguments[0].args || arguments[0].params;
      options.target = arguments[0].target;
      options.enctype = arguments[0].enctype;
    } else {
      options.action = arguments[0];
      options.args = arguments.length > 1 ? arguments[1] : {};
      options.target = arguments.length > 2 ? arguments[2] : '';
      options.enctype = arguments.length > 3 ? arguments[3] : '';
    }

    frm.action = options.action;

    if ((0, _locustjsBase.isSomeString)(options.target)) {
      frm.target = options.target;
    }

    if ((0, _locustjsBase.isSomeString)(options.enctype)) {
      frm.enctype = options.enctype;
    }

    if ((0, _locustjsBase.isSomeObject)(options.args)) {
      for (var _i2 = 0, _Object$keys = Object.keys(options.args); _i2 < _Object$keys.length; _i2++) {
        var key = _Object$keys[_i2];
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = options.args[key];
        frm.appendChild(input);
      }
    }

    var body = document.getElementsByTagName('body');

    if (body && body.length) {
      body = body[0];
      body.appendChild(frm);
      frm.submit();
    }
  }
};

exports.post = post;

var _getValue = function getValue(form, key) {
  var frm;
  var el;
  var type;
  var tag;
  var name;
  var count = 0;
  var result;
  var radio = false;

  if ((0, _locustjsBase.isSomeString)(form)) {
    frm = document.querySelector(form);
  } else if ((0, _locustjsBase.isSomeObject)(form)) {
    frm = form.context ? form[0] : form;
  } else if ((0, _locustjsBase.isArray)(form) && form.length) {
    frm = form[0];
  }

  if (!(0, _locustjsBase.isEmpty)(frm) && (0, _locustjsBase.isSomeString)(key) && frm.elements && frm.elements.length) {
    result = [];

    for (var i = 0; i < frm.elements.length; i++) {
      el = frm.elements[i];
      name = (el.name || '').toLowerCase();
      type = (el.type || '').toLowerCase();
      tag = (el.tagName || '').toLowerCase();

      if (key.toLowerCase() == name || key == el.id || key[0] == '#' && key.substr(1) == el.id) {
        count++;

        if (type == 'checkbox' || type == 'radio') {
          if (type == 'radio') {
            radio = true;
          }

          if (el.checked) {
            result.push(el.value);
          }
        } else if (tag == 'select') {
          var subResult = [];

          for (var j = 0; j < el.selectedOptions.length; j++) {
            subResult.push(el.selectedOptions[j].value);
          }

          if (el.multiple) {
            result.push(subResult);
          } else {
            result.push(subResult[0]);
          }
        } else {
          result.push(el.value);
        }
      }
    }

    if (count == 1 || radio) {
      result = result.length ? result[0] : '';
    }
  }

  return result;
};

exports.getValue = _getValue;

var _setValue = function setValue(form, key, value) {
  var frm;
  var el;
  var type;
  var tag;
  var name;

  if ((0, _locustjsBase.isSomeString)(form)) {
    frm = document.querySelector(form);
  } else if ((0, _locustjsBase.isSomeObject)(form)) {
    frm = form.context ? form[0] : form;
  } else if ((0, _locustjsBase.isArray)(form) && form.length) {
    frm = form[0];
  }

  if (!(0, _locustjsBase.isEmpty)(frm) && (0, _locustjsBase.isSomeString)(key) && frm.elements && frm.elements.length) {
    var _value = (value || '').toString().toLowerCase();

    for (var i = 0; i < frm.elements.length; i++) {
      el = frm.elements[i];
      name = (el.name || '').toLowerCase();
      type = (el.type || '').toLowerCase();
      tag = (el.tagName || '').toLowerCase();

      if (key.toLowerCase() == name || key == el.id || key[0] == '#' && key.substr(1) == el.id) {
        if (type == 'checkbox') {
          if ((0, _locustjsBase.isArray)(value)) {
            el.checked = (0, _locustjsExtensionsArray.contains)(value, el.value);
          } else {
            el.checked = el.value.toLowerCase() == _value;
          }
        } else if (type == 'radio') {
          el.checked = el.value.toLowerCase() == _value;
        } else if (tag == 'select') {
          for (var j = 0; j < el.options.length; j++) {
            var opt = el.options[j];

            if ((0, _locustjsBase.isArray)(value)) {
              opt.selected = (0, _locustjsExtensionsArray.contains)(value, opt.value) || value.indexOf(j) >= 0;
            } else {
              opt.selected = opt.value.toLowerCase() == _value;
            }
          }
        } else {
          el.value = value;
        }
      }
    }
  }
};

exports.setValue = _setValue;

var Form = /*#__PURE__*/function () {
  function Form(selector) {
    _classCallCheck(this, Form);

    this._form = document.querySelector(selector);
  }

  _createClass(Form, [{
    key: "each",
    value: function each(callback, excludes) {
      return formEach(this.instance, callback, excludes);
    }
  }, {
    key: "eachElement",
    value: function eachElement(callback, excludes) {
      return formEachElement(this.instance, callback, excludes);
    }
  }, {
    key: "enable",
    value: function enable() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      enableForm(this.instance, value);
    }
  }, {
    key: "disable",
    value: function disable() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      disableForm(this.instance, value);
    }
  }, {
    key: "readOnly",
    value: function readOnly() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      readOnlyForm(this.instance, value);
    }
  }, {
    key: "unreadOnly",
    value: function unreadOnly() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      unreadOnlyForm(this.instance, value);
    }
  }, {
    key: "clear",
    value: function clear() {
      clearForm(this.instance);
    }
  }, {
    key: "reset",
    value: function reset() {
      resetForm(this.instance);
    }
  }, {
    key: "fromJson",
    value: function fromJson() {
      _fromJson(this.instance);
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return _toJson(this.instance);
    }
  }, {
    key: "fromArray",
    value: function fromArray() {
      _fromArray(this.instance);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return _toArray(this.instance);
    }
  }, {
    key: "getValue",
    value: function getValue(key) {
      return _getValue(this.instance, key);
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      _setValue(this.instance, key, value);
    }
  }, {
    key: "instance",
    get: function get() {
      return this._form;
    },
    set: function set(value) {
      this._form = value;
    }
  }]);

  return Form;
}();

exports.Form = Form;
var FormHelper = {
  each: formEach,
  eachElement: formEachElement,
  disable: disableForm,
  enable: enableForm,
  readOnly: readOnlyForm,
  unreadOnly: unreadOnlyForm,
  toArray: _toArray,
  fromArray: _fromArray,
  toJson: _toJson,
  fromJson: _fromJson,
  clear: clearForm,
  reset: resetForm,
  post: post,
  isEditable: isEditable,
  getValue: _getValue,
  setValue: _setValue
};
var _default = FormHelper;
exports.default = _default;