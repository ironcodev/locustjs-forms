'use strict';

var base = require('@locustjs/base');
var extensionsArray = require('@locustjs/extensions-array');
var extensionsObject = require('@locustjs/extensions-object');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var formEachElement = function formEachElement() {
  var selector = "form";
  var callback;
  var hasCallback = false;
  var hasExcludes = false;
  var excludes;
  var forms = null;
  var temp;
  var result = [];
  function _setExcludes(arg) {
    if (base.isFunction(arg)) {
      excludes = arg;
      hasExcludes = true;
    } else {
      if (base.isSomeString(arg)) {
        arg = arg.split(",");
      }
      if (base.isArray(arg)) {
        var classNames = arg.filter(function (x) {
          return x && x[0] == ".";
        });
        excludes = function excludes(frm, el) {
          if (extensionsArray.contains(arg, el.tagName)) {
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
    if (base.isFunction(temp)) {
      callback = temp;
      hasCallback = true;
    } else if (base.isSomeString(temp)) {
      selector = temp;
    } else if (base.isArray(temp)) {
      selector = "";
      forms = temp;
    } else if (base.isSomeObject(temp)) {
      selector = "";
      forms = [temp];
    }
    if (arguments.length > 1) {
      temp = arguments[1];
      if (base.isFunction(temp)) {
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
    if (forms && forms.length) {
      for (var i = 0; i < forms.length; i++) {
        var frm = forms[i];
        var elements = frm && frm.elements;
        var arr = [];
        if (base.isEmpty(elements) || elements.length == 0) {
          if (base.isFunction(frm.querySelectorAll)) {
            elements = frm.querySelectorAll("input, select, textarea");
          }
        }
        if (elements && elements.length) {
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

var NON_DATA_ENTRY_INPUT_TYPES = ["button", "submit", "reset", "image"];
var NON_DATA_ENTRY_TAGS = ["button", "fieldset", "legend"];
var isEditable = function isEditable(el) {
  var result = false;
  if (el) {
    var _type = (el.type || "").toLowerCase();
    var _tag = (el.tagName || "").toLowerCase();
    result = !(NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 || NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0);
  }
  return result;
};

var formEach = function formEach(selector, callback, excludes) {
  if (excludes == null) {
    excludes = function excludes(frm, el) {
      return !isEditable(el);
    };
  }
  return formEachElement(selector, callback, excludes);
};

var disable = function disable(selector, excludes, mode) {
  return formEachElement(selector, function (frm, el) {
    if (base.isBool(excludes) && base.isUndefined(mode)) {
      mode = excludes;
    }
    el.disabled = base.isBool(mode) ? mode : true;
  }, excludes);
};
var enable = function enable(selector, excludes, mode) {
  return formEachElement(selector, function (frm, el) {
    if (base.isBool(excludes) && base.isUndefined(mode)) {
      mode = excludes;
    }
    el.disabled = base.isBool(mode) ? !mode : false;
  }, excludes);
};
var readOnly = function readOnly(selector, excludes, mode) {
  return formEach(selector, function (frm, el) {
    if (base.isBool(excludes) && base.isUndefined(mode)) {
      mode = excludes;
    }
    el.readOnly = base.isBool(mode) ? mode : true;
  }, excludes);
};
var reset = function reset(selector) {
  return formEachElement(selector, function (frm) {
    if (frm && base.isFunction(frm.reset)) {
      frm.reset();
    }
  });
};
var clear = function clear(selector, excludes) {
  var includeHiddenFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return formEach(selector, function (frm, el, i) {
    var type = (el.type || "").toLowerCase();
    (el.tagName || "").toLowerCase();
    if (type == "checkbox" || type == "radio") {
      el.checked = false;
    } else if (type == "select") {
      if (el.options && el.options.length) {
        var _iterator = _createForOfIteratorHelper(el.options),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var opt = _step.value;
            opt.selected = false;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    } else if (type != "hidden" || includeHiddenFields) {
      el.value = "";
    }
  }, excludes);
};

var has = function has(el, name) {
  var result = false;
  var attrs = el.attributes;
  if (el && el.attributes && el.attributes.length) {
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name.toLowerCase() == name) {
        result = true;
        break;
      }
    }
  }
  return result;
};
var hasValue = function hasValue(el) {
  return has(el, "value");
};

var fromArray = function fromArray(selector, obj, excludes) {
  if (base.isArray(obj)) {
    var isArrayOfArray = true;
    for (var i = 0; i < obj.length; i++) {
      if (!base.isArray(obj[i])) {
        isArrayOfArray = false;
        break;
      }
    }
    formEach(selector, function (frm, el, i, j) {
      var _type = (el.type || "").toLowerCase();
      var _tag = (el.tagName || "").toLowerCase();
      var _name = el.name;
      var _id = el.id;
      var _key = _name || _id;
      if (base.isEmpty(_key)) {
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
        if (_type == "checkbox" || _type == "radio") {
          if (base.isBool(value)) {
            el.checked = value;
          } else if (base.isArray(value)) {
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
        } else if (_tag == "select") {
          if (el.multiple) {
            if (base.isArray(value)) {
              for (var ii = 0; ii < el.options.length; ii++) {
                el.options[ii].selected = extensionsArray.contains(value, el.options[ii].value);
              }
            } else {
              for (var _ii = 0; _ii < el.options.length; _ii++) {
                el.options[_ii].selected = el.options[_ii].value == value || _ii === value;
              }
            }
          } else {
            for (var _ii2 = 0; _ii2 < el.options.length; _ii2++) {
              el.options[_ii2].selected = el.options[_ii2].value == value || _ii2 === value;
            }
          }
        } else {
          el.value = value;
        }
      }
    }, excludes);
  }
};

var fromJson = function fromJson(selector, obj, excludes, flattenProps) {
  if (base.isSomeObject(obj) || base.isArray(obj)) {
    var checkboxes = [];
    formEach(selector, function (frm, el, i, j) {
      var _type = (el.type || "").toLowerCase();
      var _tag = (el.tagName || "").toLowerCase();
      var _name = el.name;
      var _id = el.id;
      var _key = _name || _id;
      if (base.isEmpty(_key)) {
        _key = i;
      }
      var form = base.isArray(obj) ? obj[j] : obj;
      if (flattenProps) {
        form = extensionsObject.flatten(form);
      }
      var value = form && form[_key];
      if (value != null) {
        if (base.isSomeObject(value) && base.isSomeString(_key)) {
          var dotIndex = _key.indexOf(".");
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
            dotIndex = _key.indexOf(".", dotIndex + 1);
          }
          value = prevObj ? prevObj[_key.substr(prevIndex)] : null;
        }
        if (value != null) {
          if (_type == "checkbox" || _type == "radio") {
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
            if (base.isBool(value)) {
              el.checked = value;
            } else if (base.isArray(value)) {
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
          } else if (_tag == "select") {
            if (el.multiple) {
              if (base.isArray(value)) {
                for (var ii = 0; ii < el.options.length; ii++) {
                  el.options[ii].selected = extensionsArray.contains(value, el.options[ii].value);
                }
              } else {
                for (var _ii = 0; _ii < el.options.length; _ii++) {
                  el.options[_ii].selected = el.options[_ii].value == value || _ii === value;
                }
              }
            } else {
              for (var _ii2 = 0; _ii2 < el.options.length; _ii2++) {
                el.options[_ii2].selected = el.options[_ii2].value == value || _ii2 === value;
              }
            }
          } else {
            el.value = value;
          }
        }
      }
    }, excludes);
  }
};

var getFormElements = function getFormElements(form) {
  var result = [];
  var frm;
  if (base.isSomeString(form)) {
    frm = document.querySelector(form);
  } else if (base.isArray(form)) {
    frm = form.length ? form[0] : null;
  } else if (base.isSomeObject(form)) {
    frm = form.context ? form[0] : form;
  }
  if (!base.isEmpty(frm) && frm.elements && base.isIterable(frm.elements)) {
    result = frm.elements;
  }
  return result;
};
var getValue = function getValue(form, key) {
  var result;
  if (base.isSomeString(key)) {
    var type;
    var tag;
    var name;
    var count = 0;
    var radio = false;
    var _key = key.toLowerCase();
    var elements = getFormElements(form);
    result = [];
    var _iterator = _createForOfIteratorHelper(elements),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;
        name = (el.name || "").toLowerCase();
        type = (el.type || "").toLowerCase();
        tag = (el.tagName || "").toLowerCase();
        if (_key == name || key == el.id || key[0] == "#" && key.substr(1) == el.id) {
          count++;
          if (type == "checkbox" || type == "radio") {
            if (type == "radio") {
              radio = true;
            }
            if (el.checked) {
              result.push(el.value);
            }
          } else if (tag == "select") {
            var subResult = [];
            for (var j = 0; j < el.selectedOptions.length; j++) {
              subResult.push(el.selectedOptions[j].value);
            }
            if (el.multiple) {
              result.push(subResult);
            } else {
              if (subResult.length) {
                result.push(subResult[0]);
              }
            }
          } else {
            result.push(el.value);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (count == 1 || radio) {
      result = result.length ? result[0] : "";
    }
  }
  return result;
};
var setValue = function setValue(form, key, value) {
  if (base.isSomeString(key)) {
    var type;
    var tag;
    var name;
    var _key = key.toLowerCase();
    var elements = getFormElements(form);
    var _value = (value || "").toString().toLowerCase();
    var _iterator2 = _createForOfIteratorHelper(elements),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var el = _step2.value;
        name = (el.name || "").toLowerCase();
        type = (el.type || "").toLowerCase();
        tag = (el.tagName || "").toLowerCase();
        if (_key == name || key == el.id || key[0] == "#" && key.substr(1) == el.id) {
          if (type == "checkbox") {
            if (base.isArray(value)) {
              el.checked = extensionsArray.contains(value, el.value);
            } else {
              el.checked = base.isBool(value) ? value : el.value.toLowerCase() == _value;
            }
          } else if (type == "radio") {
            el.checked = base.isBool(value) ? value : el.value.toLowerCase() == _value;
          } else if (tag == "select") {
            for (var j = 0; j < el.options.length; j++) {
              var opt = el.options[j];
              if (base.isArray(value)) {
                opt.selected = extensionsArray.contains(value, opt.value) || value.indexOf(j) >= 0;
              } else {
                opt.selected = opt.value == _value || j === value;
              }
            }
          } else {
            el.value = value;
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
};

var post = function post() {
  if (arguments.length) {
    var options = {
      action: "",
      enctype: "",
      target: "",
      args: {}
    };
    var frm = document.createElement("FORM");
    frm.method = "post";
    if (base.isObject(arguments[0])) {
      options.action = arguments[0].url || arguments[0].action;
      options.args = arguments[0].args || arguments[0].params;
      options.target = arguments[0].target;
      options.enctype = arguments[0].enctype;
    } else {
      options.action = arguments[0];
      options.args = arguments.length > 1 ? arguments[1] : {};
      options.target = arguments.length > 2 ? arguments[2] : "";
      options.enctype = arguments.length > 3 ? arguments[3] : "";
    }
    frm.action = options.action;
    if (base.isSomeString(options.target)) {
      frm.target = options.target;
    }
    if (base.isSomeString(options.enctype)) {
      frm.enctype = options.enctype;
    }
    if (base.isSomeObject(options.args)) {
      for (var _i = 0, _Object$keys = Object.keys(options.args); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = options.args[key];
        frm.appendChild(input);
      }
    }
    var body = document.getElementsByTagName("body");
    if (body && body.length) {
      body = body[0];
      body.appendChild(frm);
      frm.submit();
    }
  }
};

var toArray = function toArray(selector, excludes) {
  var result = [];
  var checkboxes = [];
  formEach(selector, function (frm, el, i, j) {
    if (result[j] == undefined) {
      result[j] = [];
    }
    var _type = (el.type || "").toLowerCase();
    var _tag = (el.tagName || "").toLowerCase();
    var _name = el.name;
    var _id = el.id;
    var _key = _name || _id;
    if (base.isEmpty(_key)) {
      _key = i;
    }
    if (_type == "checkbox") {
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
    } else if (_type == "radio") {
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
    } else if (_tag == "select") {
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
        if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
          result[j].push({
            name: _key,
            value: el.options[el.selectedIndex] ? el.options[el.selectedIndex].value : undefined
          });
        } else {
          result[j].push({
            name: _key,
            value: undefined
          });
        }
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
      var _iterator = _createForOfIteratorHelper(checkboxes),
        _step;
      try {
        var _loop = function _loop() {
          var item = _step.value;
          if (item.count == 1) {
            var e = result[item.form].find(function (x) {
              return x.name == item.key;
            });
            if (e && e.value.length == 1) {
              e.value = e.value[0];
            }
          }
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    if (result.length == 1) {
      return result[0];
    }
  }
  return result;
};

var toJson = function toJson(selector, excludes, expandNames) {
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
    if (base.isEmpty(_key)) {
      _key = i;
    }
    if (_type == 'checkbox') {
      if (!base.isArray(result[j][_key])) {
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
        } else if (!has(el, "name")) {
          result[j][_key].push("");
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
        if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
          result[j][_key] = el.options[el.selectedIndex] ? el.options[el.selectedIndex].value : undefined;
        } else {
          result[j][_key] = undefined;
        }
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
      var _iterator = _createForOfIteratorHelper(checkboxes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.count == 1) {
            if (result[item.form][item.key].length == 1) {
              result[item.form][item.key] = result[item.form][item.key][0];
            } else {
              result[item.form][item.key] = false;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    if (expandNames) {
      result = extensionsObject.unflatten(result);
    }
    if (result.length == 1) {
      result = result[0];
    }
  }
  return result;
};

var Form = /*#__PURE__*/function () {
  function Form(selector) {
    _classCallCheck(this, Form);
    this._form = document.querySelector(selector);
  }
  return _createClass(Form, [{
    key: "instance",
    get: function get() {
      return this._form;
    },
    set: function set(value) {
      this._form = value;
    }
  }, {
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
    value: function enable$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      enable.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "disable",
    value: function disable$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      disable.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "readOnly",
    value: function readOnly$1() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      readOnly.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "clear",
    value: function clear$1() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      clear.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "reset",
    value: function reset$1() {
      reset(this.instance);
    }
  }, {
    key: "fromJson",
    value: function fromJson$1() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      fromJson.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "toJson",
    value: function toJson$1() {
      return toJson(this.instance);
    }
  }, {
    key: "fromArray",
    value: function fromArray$1() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      fromArray.apply(void 0, [this.instance].concat(args));
    }
  }, {
    key: "toArray",
    value: function toArray$1() {
      return toArray(this.instance);
    }
  }, {
    key: "getValue",
    value: function getValue$1(key) {
      return getValue(this.instance, key);
    }
  }, {
    key: "setValue",
    value: function setValue$1(key, value) {
      setValue(this.instance, key, value);
    }
  }], [{
    key: "each",
    value: function each() {
      return formEach.apply(void 0, arguments);
    }
  }, {
    key: "eachElement",
    value: function eachElement() {
      return formEachElement.apply(void 0, arguments);
    }
  }, {
    key: "enable",
    value: function enable$1() {
      enable.apply(void 0, arguments);
    }
  }, {
    key: "disable",
    value: function disable$1() {
      disable.apply(void 0, arguments);
    }
  }, {
    key: "readOnly",
    value: function readOnly$1() {
      readOnly.apply(void 0, arguments);
    }
  }, {
    key: "clear",
    value: function clear$1() {
      clear.apply(void 0, arguments);
    }
  }, {
    key: "reset",
    value: function reset$1() {
      reset.apply(void 0, arguments);
    }
  }, {
    key: "fromJson",
    value: function fromJson$1() {
      fromJson.apply(void 0, arguments);
    }
  }, {
    key: "toJson",
    value: function toJson$1() {
      return toJson.apply(void 0, arguments);
    }
  }, {
    key: "fromArray",
    value: function fromArray$1() {
      fromArray.apply(void 0, arguments);
    }
  }, {
    key: "toArray",
    value: function toArray$1() {
      return toArray.apply(void 0, arguments);
    }
  }, {
    key: "getValue",
    value: function getValue$1() {
      return getValue.apply(void 0, arguments);
    }
  }, {
    key: "setValue",
    value: function setValue$1() {
      setValue.apply(void 0, arguments);
    }
  }]);
}();

exports.Form = Form;
exports.clear = clear;
exports.disable = disable;
exports.enable = enable;
exports.formEach = formEach;
exports.formEachElement = formEachElement;
exports.fromArray = fromArray;
exports.fromJson = fromJson;
exports.getValue = getValue;
exports.has = has;
exports.hasValue = hasValue;
exports.isEditable = isEditable;
exports.post = post;
exports.readOnly = readOnly;
exports.reset = reset;
exports.setValue = setValue;
exports.toArray = toArray;
exports.toJson = toJson;
