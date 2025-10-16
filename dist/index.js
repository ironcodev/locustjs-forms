'use strict';

var base = require('@locustjs/base');
var extensionsArray = require('@locustjs/extensions-array');
var extensionsObject = require('@locustjs/extensions-object');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
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
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(t.prototype ), o, e);
  return "function" == typeof p ? function (t) {
    return p.apply(e, t);
  } : p;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
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
        excludes = function excludes(_ref) {
          var element = _ref.element;
          if (extensionsArray.contains(arg, element.tagName)) {
            return true;
          }
          var _iterator = _createForOfIteratorHelper(classNames),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var className = _step.value;
              var _iterator2 = _createForOfIteratorHelper(element.classList),
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
            var args = {
              form: frm,
              element: elements[j],
              index: j,
              formIndex: i
            };
            if (!hasExcludes || !excludes(args)) {
              var r = callback(args);
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
var isEditable = function isEditable(element) {
  var result = false;
  if (element) {
    var _type = (element.type || "").toLowerCase();
    var _tag = (element.tagName || "").toLowerCase();
    result = !(NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 || NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0);
  }
  return result;
};

var formEach = function formEach(selector, callback, excludes) {
  if (excludes == null) {
    excludes = function excludes(_ref) {
      var element = _ref.element;
      return !isEditable(element);
    };
  }
  return formEachElement(selector, callback, excludes);
};

var _FormElementReadOnlyFactory;
var _preventDefault = function _preventDefault(e) {
  return e.preventDefault();
};
var FormElementReadOnlyStrategyBase = /*#__PURE__*/function () {
  function FormElementReadOnlyStrategyBase() {
    _classCallCheck(this, FormElementReadOnlyStrategyBase);
  }
  return _createClass(FormElementReadOnlyStrategyBase, [{
    key: "readOnly",
    value: function readOnly(element, mode) {
      throw "".concat(this.constructor.name, ".readOnly() is not implemented");
    }
  }]);
}();
var FormElementReadOnlyByAttribute = /*#__PURE__*/function (_FormElementReadOnlyS) {
  function FormElementReadOnlyByAttribute() {
    _classCallCheck(this, FormElementReadOnlyByAttribute);
    return _callSuper(this, FormElementReadOnlyByAttribute, arguments);
  }
  _inherits(FormElementReadOnlyByAttribute, _FormElementReadOnlyS);
  return _createClass(FormElementReadOnlyByAttribute, [{
    key: "readOnly",
    value: function readOnly(element, mode) {
      if (element) {
        var tag = (element.tagName || "").toLowerCase();
        var type = (element.type || "").toLowerCase();
        if ((tag == "input" || tag == "textarea") && type != "checkbox" && type != "radio" && type != "range" && type != "color" && type != "file" && type != "button" && type != "hidden") {
          element.readOnly = base.isBool(mode) ? mode : true;
          return true;
        }
      }
      return false;
    }
  }]);
}(FormElementReadOnlyStrategyBase);
var FormElementReadOnlyByJavascript = /*#__PURE__*/function (_FormElementReadOnlyB) {
  function FormElementReadOnlyByJavascript() {
    _classCallCheck(this, FormElementReadOnlyByJavascript);
    return _callSuper(this, FormElementReadOnlyByJavascript, arguments);
  }
  _inherits(FormElementReadOnlyByJavascript, _FormElementReadOnlyB);
  return _createClass(FormElementReadOnlyByJavascript, [{
    key: "readOnly",
    value: function readOnly(element, mode) {
      if (!_superPropGet(FormElementReadOnlyByJavascript, "readOnly", this)([element, mode])) {
        var _readOnly = base.isBool(mode) ? mode : true;
        if (_readOnly) {
          element.addEventListener("focus", _preventDefault);
          element.addEventListener("click", _preventDefault);
          element.addEventListener("change", _preventDefault);
          element.addEventListener("mousedown", _preventDefault);
          element.addEventListener("keydown", _preventDefault);
        } else {
          element.removeEventListener("focus", _preventDefault);
          element.removeEventListener("click", _preventDefault);
          element.removeEventListener("change", _preventDefault);
          element.removeEventListener("mousedown", _preventDefault);
          element.removeEventListener("keydown", _preventDefault);
        }
      }
      return true;
    }
  }]);
}(FormElementReadOnlyByAttribute);
var FormElementReadOnlyByCss = /*#__PURE__*/function (_FormElementReadOnlyB2) {
  function FormElementReadOnlyByCss() {
    _classCallCheck(this, FormElementReadOnlyByCss);
    return _callSuper(this, FormElementReadOnlyByCss, arguments);
  }
  _inherits(FormElementReadOnlyByCss, _FormElementReadOnlyB2);
  return _createClass(FormElementReadOnlyByCss, [{
    key: "_isSelectorDefined",
    value: function _isSelectorDefined(selector) {
      var _iterator = _createForOfIteratorHelper(document.styleSheets),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var sheet = _step.value;
          try {
            var _iterator2 = _createForOfIteratorHelper(sheet.cssRules),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var rule = _step2.value;
                if (rule.selectorText === selector) {
                  return true;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } catch (e) {
            // Some stylesheets may be cross-origin and throw errors
            continue;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false;
    }
  }, {
    key: "_addReadOnlyCssRule",
    value: function _addReadOnlyCssRule(selector) {
      if (document && base.isFunction(document.createElement) && !this._isSelectorDefined(selector)) {
        var style = document.createElement("style");
        var arr = [];
        base.forEach(FormElementReadOnlyByCss.readonlyCssStyle, function (_ref) {
          var key = _ref.key,
            value = _ref.value;
          return arr.push("".concat(key, ": ").concat(value, ";"));
        });
        style.textContent = "".concat(selector, " {\n    ").concat(arr.join("\n"), "\n  }");
        document.head.appendChild(style);
      }
    }
  }, {
    key: "readOnly",
    value: function readOnly(element, mode) {
      if (!_superPropGet(FormElementReadOnlyByCss, "readOnly", this)([element, mode])) {
        this._addReadOnlyCssRule(FormElementReadOnlyByCss.readonlyCssClassName);
        var _readOnly2 = base.isBool(mode) ? mode : true;
        var readOnlyClassName = FormElementReadOnlyByCss.readonlyCssClassName.substr(1);
        if (_readOnly2) {
          element.classList.add(readOnlyClassName);
        } else {
          element.classList.remove(readOnlyClassName);
        }
      }
      return true;
    }
  }]);
}(FormElementReadOnlyByAttribute);
_defineProperty(FormElementReadOnlyByCss, "readonlyCssClassName", ".locust-forms-readonly");
_defineProperty(FormElementReadOnlyByCss, "readonlyCssStyle", {
  "pointer-events": "none",
  opacity: "1"
});
var FormElementReadOnlyFactory = /*#__PURE__*/function () {
  function FormElementReadOnlyFactory() {
    _classCallCheck(this, FormElementReadOnlyFactory);
  }
  return _createClass(FormElementReadOnlyFactory, null, [{
    key: "getStrategy",
    value: function getStrategy(value) {
      var result = FormElementReadOnlyFactory.def;
      if (value) {
        if (base.isObject(value)) {
          if (base.isFunction(value.readOnly)) {
            result = value;
          }
        } else if (base.isSomeString(value)) {
          switch (value.toLowerCase()) {
            case "attribute":
              result = FormElementReadOnlyFactory.attr;
              break;
            case "js":
            case "javascript":
              result = FormElementReadOnlyFactory.js;
              break;
            case "css":
              result = FormElementReadOnlyFactory.css;
              break;
          }
        }
      }
      return result;
    }
  }]);
}();
_FormElementReadOnlyFactory = FormElementReadOnlyFactory;
_defineProperty(FormElementReadOnlyFactory, "js", new FormElementReadOnlyByJavascript());
_defineProperty(FormElementReadOnlyFactory, "attr", new FormElementReadOnlyByAttribute());
_defineProperty(FormElementReadOnlyFactory, "css", new FormElementReadOnlyByCss());
_defineProperty(FormElementReadOnlyFactory, "def", _FormElementReadOnlyFactory.css);
var disable = function disable(selector, excludes, mode) {
  if (base.isBool(excludes) && base.isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }
  return formEachElement(selector, function (_ref2) {
    var element = _ref2.element;
    element.disabled = base.isBool(mode) ? mode : true;
  }, excludes);
};
var enable = function enable(selector, excludes, mode) {
  if (base.isBool(excludes) && base.isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }
  return formEachElement(selector, function (_ref3) {
    var element = _ref3.element;
    element.disabled = base.isBool(mode) ? !mode : false;
  }, excludes);
};
var readOnly = function readOnly(selector, excludes, mode, readOnlyStrategy) {
  if (base.isBool(excludes) && base.isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }
  return formEach(selector, function (_ref4) {
    var element = _ref4.element;
    var rs = FormElementReadOnlyFactory.getStrategy(readOnlyStrategy);
    rs.readOnly(element, mode);
  }, excludes);
};
var reset = function reset(selector) {
  return formEachElement(selector, function (_ref5) {
    var form = _ref5.form;
    if (form && base.isFunction(form.reset)) {
      form.reset();
    }
  });
};
var clear = function clear(selector, excludes) {
  var includeHiddenFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return formEach(selector, function (_ref6) {
    var element = _ref6.element;
    var type = (element.type || "").toLowerCase();
    (element.tagName || "").toLowerCase();
    if (type == "checkbox" || type == "radio") {
      element.checked = false;
    } else if (type == "select") {
      if (element.options && element.options.length) {
        var _iterator3 = _createForOfIteratorHelper(element.options),
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
    } else if (type != "hidden" || includeHiddenFields) {
      element.value = "";
    }
  }, excludes);
};

var has = function has(element, name) {
  var result = false;
  var attrs = element.attributes;
  if (element && element.attributes && element.attributes.length) {
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

var fromArray = function fromArray(selector, arr, excludes) {
  if (base.isArray(arr)) {
    var isArrayOfArray = true;
    for (var i = 0; i < arr.length; i++) {
      if (!base.isArray(arr[i])) {
        isArrayOfArray = false;
        break;
      }
    }
    formEach(selector, function (_ref) {
      var form = _ref.form,
        element = _ref.element,
        index = _ref.index,
        formIndex = _ref.formIndex;
      var _type = (element.type || "").toLowerCase();
      var _tag = (element.tagName || "").toLowerCase();
      var _name = element.name;
      var _id = element.id;
      var _key = _name || _id;
      if (base.isEmpty(_key)) {
        _key = index;
      }
      var data = isArrayOfArray ? arr[formIndex] : arr;
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
            element.checked = value;
          } else if (base.isArray(value)) {
            if (value.length == 1) {
              if (hasValue(element)) {
                element.checked = element.value == value[0];
              } else {
                element.checked = value[0];
              }
            } else {
              if (hasValue(element)) {
                element.checked = value.indexOf(element.value) >= 0;
              } else {
                if (_name && form.querySelectorAll) {
                  var els = form.querySelectorAll('[name="' + _name + '"]');
                  if (els && els.length) {
                    for (var _i = 0; _i < els.length; _i++) {
                      if (els[_i] == element) {
                        if (value.length > _i) {
                          element.checked = value[_i];
                        }
                        break;
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (hasValue(element)) {
              element.checked = element.value == value;
            } else {
              element.checked = value;
            }
          }
        } else if (_tag == "select") {
          if (element.multiple) {
            if (base.isArray(value)) {
              for (var ii = 0; ii < element.options.length; ii++) {
                element.options[ii].selected = extensionsArray.contains(value, element.options[ii].value);
              }
            } else {
              for (var _ii = 0; _ii < element.options.length; _ii++) {
                element.options[_ii].selected = element.options[_ii].value == value || _ii === value;
              }
            }
          } else {
            for (var _ii2 = 0; _ii2 < element.options.length; _ii2++) {
              element.options[_ii2].selected = element.options[_ii2].value == value || _ii2 === value;
            }
          }
        } else {
          element.value = value;
        }
      }
    }, excludes);
  }
};

var fromJson = function fromJson(selector, obj, excludes, flattenProps) {
  if (base.isSomeObject(obj) || base.isArray(obj)) {
    var checkboxes = [];
    formEach(selector, function (_ref) {
      var element = _ref.element,
        index = _ref.index,
        formIndex = _ref.formIndex;
      var _type = (element.type || "").toLowerCase();
      var _tag = (element.tagName || "").toLowerCase();
      var _name = element.name;
      var _id = element.id;
      var _key = _name || _id;
      if (base.isEmpty(_key)) {
        _key = index;
      }
      var frm = base.isArray(obj) ? obj[formIndex] : obj;
      if (flattenProps) {
        frm = extensionsObject.flatten(frm);
      }
      var value = frm && frm[_key];
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
              return x.form == formIndex && x.key == _key;
            });
            if (!item) {
              item = {
                form: formIndex,
                key: _key,
                count: 1
              };
              checkboxes.push(item);
            } else {
              item.count++;
            }
            if (base.isBool(value)) {
              element.checked = value;
            } else if (base.isArray(value)) {
              if (value.length == 1) {
                if (hasValue(element)) {
                  element.checked = element.value == value[0];
                } else {
                  element.checked = value[0];
                }
              } else {
                if (hasValue(element)) {
                  element.checked = value.indexOf(element.value) >= 0;
                } else {
                  element.checked = item.count > 0 && item.count <= value.length && value[item.count - 1];
                }
              }
            } else {
              if (hasValue(element)) {
                element.checked = element.value == value;
              } else {
                element.checked = value;
              }
            }
          } else if (_tag == "select") {
            if (element.multiple) {
              if (base.isArray(value)) {
                for (var ii = 0; ii < element.options.length; ii++) {
                  element.options[ii].selected = extensionsArray.contains(value, element.options[ii].value);
                }
              } else {
                for (var _ii = 0; _ii < element.options.length; _ii++) {
                  element.options[_ii].selected = element.options[_ii].value == value || _ii === value;
                }
              }
            } else {
              for (var _ii2 = 0; _ii2 < element.options.length; _ii2++) {
                element.options[_ii2].selected = element.options[_ii2].value == value || _ii2 === value;
              }
            }
          } else {
            element.value = value;
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
  formEach(selector, function (_ref) {
    var element = _ref.element,
      index = _ref.index,
      formIndex = _ref.formIndex;
    if (result[formIndex] == undefined) {
      result[formIndex] = [];
    }
    var _type = (element.type || "").toLowerCase();
    var _tag = (element.tagName || "").toLowerCase();
    var _name = element.name;
    var _id = element.id;
    var _key = _name || _id;
    if (base.isEmpty(_key)) {
      _key = index;
    }
    if (_type == "checkbox") {
      var item = checkboxes.find(function (x) {
        return x.form == formIndex && x.key == _key;
      });
      if (!item) {
        item = {
          form: formIndex,
          key: _key,
          count: 1
        };
        checkboxes.push(item);
      } else {
        item.count++;
      }
      var _index = -1;
      var arr;
      for (var ii = 0; ii < result[formIndex].length; ii++) {
        if (result[formIndex][ii].name == _key) {
          _index = ii;
          break;
        }
      }
      if (_index >= 0) {
        arr = result[formIndex][_index].value;
      }
      if (element.checked) {
        if (arr) {
          if (hasValue(element)) {
            arr.push(element.value);
          } else {
            arr.push(true);
          }
        } else {
          if (hasValue(element)) {
            result[formIndex].push({
              name: _key,
              value: [element.value]
            });
          } else {
            result[formIndex].push({
              name: _key,
              value: [true]
            });
          }
        }
      }
    } else if (_type == "radio") {
      if (element.checked) {
        if (hasValue(element)) {
          result[formIndex].push({
            name: _key,
            value: element.value
          });
        } else {
          result[formIndex].push({
            name: _key,
            value: true
          });
        }
      }
    } else if (_tag == "select") {
      if (element.multiple) {
        var temp = [];
        for (var _ii = 0; _ii < element.selectedOptions.length; _ii++) {
          temp.push(element.selectedOptions[_ii].value);
        }
        result[formIndex].push({
          name: _key,
          value: temp
        });
      } else {
        if (element.selectedIndex >= 0 && element.selectedIndex < element.options.length) {
          result[formIndex].push({
            name: _key,
            value: element.options[element.selectedIndex] ? element.options[element.selectedIndex].value : undefined
          });
        } else {
          result[formIndex].push({
            name: _key,
            value: undefined
          });
        }
      }
    } else {
      result[formIndex].push({
        name: _key,
        value: element.value
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
  formEach(selector, function (_ref) {
    var element = _ref.element,
      index = _ref.index,
      formIndex = _ref.formIndex;
    if (result[formIndex] == undefined) {
      result[formIndex] = {};
    }
    var _type = (element.type || "").toLowerCase();
    var _tag = (element.tagName || "").toLowerCase();
    var _name = element.name;
    var _id = element.id;
    var _key = _name || _id;
    if (base.isEmpty(_key)) {
      _key = index;
    }
    if (_type == "checkbox") {
      if (!base.isArray(result[formIndex][_key])) {
        result[formIndex][_key] = [];
      }
      var item = checkboxes.find(function (x) {
        return x.form == formIndex && x.key == _key;
      });
      if (!item) {
        item = {
          form: formIndex,
          key: _key,
          count: 1
        };
        checkboxes.push(item);
      } else {
        item.count++;
      }
      if (element.checked) {
        if (hasValue(element)) {
          result[formIndex][_key].push(element.value);
        } else {
          result[formIndex][_key].push(true);
        }
      } else {
        if (!hasValue(element)) {
          result[formIndex][_key].push(false);
        } else if (!has(element, "name")) {
          result[formIndex][_key].push("");
        }
      }
    } else if (_type == "radio") {
      if (element.checked) {
        if (hasValue(element)) {
          result[formIndex][_key] = element.value;
        } else {
          result[formIndex][_key] = true;
        }
      }
    } else if (_tag == "select") {
      if (element.multiple) {
        result[formIndex][_key] = [];
        for (var ii = 0; ii < element.selectedOptions.length; ii++) {
          result[formIndex][_key].push(element.selectedOptions[ii].value);
        }
      } else {
        if (element.selectedIndex >= 0 && element.selectedIndex < element.options.length) {
          result[formIndex][_key] = element.options[element.selectedIndex] ? element.options[element.selectedIndex].value : undefined;
        } else {
          result[formIndex][_key] = undefined;
        }
      }
    } else if (_tag == "button") {
      result[formIndex][_key] = element.innerText;
    } else {
      result[formIndex][_key] = element.value;
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
    this.selector = selector;
  }
  return _createClass(Form, [{
    key: "each",
    value: function each(callback, excludes) {
      return formEach(this.selector, callback, excludes);
    }
  }, {
    key: "eachElement",
    value: function eachElement(callback, excludes) {
      return formEachElement(this.selector, callback, excludes);
    }
  }, {
    key: "enable",
    value: function enable$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      enable.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "disable",
    value: function disable$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      disable.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "readOnly",
    value: function readOnly$1() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      readOnly.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "clear",
    value: function clear$1() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      clear.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "reset",
    value: function reset$1() {
      reset(this.selector);
    }
  }, {
    key: "fromJson",
    value: function fromJson$1() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      fromJson.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "toJson",
    value: function toJson$1() {
      return toJson(this.selector);
    }
  }, {
    key: "fromArray",
    value: function fromArray$1() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      fromArray.apply(void 0, [this.selector].concat(args));
    }
  }, {
    key: "toArray",
    value: function toArray$1() {
      return toArray(this.selector);
    }
  }, {
    key: "getValue",
    value: function getValue$1(key) {
      return getValue(this.selector, key);
    }
  }, {
    key: "setValue",
    value: function setValue$1(key, value) {
      setValue(this.selector, key, value);
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
exports.FormElementReadOnlyByAttribute = FormElementReadOnlyByAttribute;
exports.FormElementReadOnlyByCss = FormElementReadOnlyByCss;
exports.FormElementReadOnlyByJavascript = FormElementReadOnlyByJavascript;
exports.FormElementReadOnlyFactory = FormElementReadOnlyFactory;
exports.FormElementReadOnlyStrategyBase = FormElementReadOnlyStrategyBase;
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
