(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@locustjs/forms"] = {}));
})(this, (function (exports) { 'use strict';

	const isString = (x, n) => (typeof x == 'string' || x instanceof String) && (n == undefined || x.length == n);
	const isNumber = (x) => (typeof x == 'number' || x instanceof Number) && !isNaN(x);
	const isDate = (x) => x instanceof Date && !isNaN(x.valueOf());
	const isBool = (x) => typeof x == 'boolean' || x instanceof Boolean;
	const isBasic = (x) => {
		const type = typeof x;
		return type == 'string' || type == 'number' || type == 'boolean' || isDate(x);
	};
	const isPrimitive = (x) => isString(x) || isNumber(x) || isDate(x) || isBool(x);
	const isNull = (x) => x === null;
	const isUndefined = (x) => x === undefined;
	const isNullOrUndefined = (x) => isNull(x) || isUndefined(x);
	const isEmpty = (x, includeAllWhitespaces = true) => isNull(x) ||
														 isUndefined(x) ||
														 (typeof x == 'number' && isNaN(x)) ||
														 (isString(x) && (x.length == 0 || (x.trim() == '' && includeAllWhitespaces)));
	const isSomeString = (x, trimWhitespaces = true) => isString(x) && (trimWhitespaces ? x.trim() != '': true);
	const isNullOrEmpty = (x) => isEmpty(x, false);
	const isAnObject = (x) => typeof x == 'object' && !isNull(x);
	const isObject = (x) => isAnObject(x) && !isPrimitive(x) && !isArray(x);
	const isSomeObject = (x) => isObject(x) && Object.keys(x).length > 0;
	const isFunction = (x) => typeof x == 'function' && typeof x.nodeType !== 'number';
	const isNumeric = (x) => (isSomeString(x) || isNumber(x)) && !isNaN(x - parseFloat(x));	// borrowed from jQuery
	const isInteger = Number.isInteger;
	const isFloat = (x) => isNumeric(x) && (Math.floor(x) - x) != 0;
	const isSomeNumber = (x) => isNumeric(x) && x != 0;
	const hasBool = function (x, options) {
		let _options;
			
		if (isString(options)) {
			_options = {
				pascal: options.indexOf('p') >= 0,
				upper: options.indexOf('u') >= 0,
				trim: options.indexOf('t') >= 0
			};
		} else {
			_options = Object.assign({
				pascal: true,
				upper: true,
				trim: true
			}, options);
		}
		
		if (isBool(x)) {
			return true;
		}

		if (isString(x)) {
			if (_options.trim) {
				x = x.trim();
			}
			if (x == 'true' || x == 'false') {
				return true;
			}
			if (_options.pascal) {
				if (x == 'True' || x == 'False') {
					return true
				}
			}
			if (_options.upper) {
				if (x == 'TRUE' || x == 'FALSE') {
					return true
				}
			}
		}

		return false;
	};
	const isArray = Array.isArray;
	const isIterable = function (x) {	 	// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator
		if (!x) {
			return false;
		}

		if (typeof x[Symbol.iterator] == 'function') {
			return true;
		}

		let parent = Object.getPrototypeOf(x);

		if (parent && typeof parent[Symbol.iterator] == 'function') {	/*	or "Symbol.iterator in Object.__proto__" or "it[Symbol.iterator]" */
			return true;
		}

		return false;
	};
	const isSomeArray = (x) => isArray(x) && x.length > 0;
	const isEqualityComparer = (x) => isObject(x) && isFunction(x.equals);
	const DefaultEqualityComparer = {
		equals: (x, y) =>
			isNullOrEmpty(x)
			? isNullOrEmpty(y)
				? true
				: false
			: isNullOrEmpty(y)
			? false
			: x.toString().toLowerCase() == y.toString().toLowerCase(),
	};

	class StackTraceItem {
	  constructor(line) {
	    if (isSomeString(line)) {
	      let colonIndex1 = line.lastIndexOf(":");
	      let colonIndex2 = line.lastIndexOf(":", colonIndex1 - 1);
	      let openParIndex = line.indexOf("(");

	      if (openParIndex < 0) {
	        openParIndex = colonIndex2;
	      }

	      let closeParIndex = line.lastIndexOf(")");

	      if (closeParIndex < 0) {
	        closeParIndex = line.length;
	      }

	      let numbers = line.substr(
	        colonIndex2 + 1,
	        closeParIndex - colonIndex2 - 1
	      );

	      numbers = numbers.split(":");

	      this.line = numbers.length > 0 ? parseInt(numbers[0]) : 0;
	      this.col = numbers.length > 1 ? parseInt(numbers[1]) : 0;
	      this.callSite = line.substr(0, openParIndex).replace("at ", "").trim();
	      this.source = line.substr(
	        openParIndex + 1,
	        colonIndex2 - openParIndex - 1
	      );
	      this.message = line.trim();
	    } else {
	      this.line = 0;
	      this.col = 0;
	      this.callSite = "";
	      this.source = "";
	      this.message = "";
	    }
	  }
	}

	class StackTrace {
	  constructor(stack) {
	    this.items = [];

	    if (isSomeString(stack)) {
	      const lines = stack.split("\n");

	      if (lines.length) {
	        for (let i = 1; i < lines.length; i++) {
	          this.items.push(new StackTraceItem(lines[i]));
	        }
	      }
	    }
	  }
	}

	/*
	      examples:
	          new Exception({
	              message: '',
	              code: 23,
	              host: '',
	              data: { name: 'foo' },
	              stack: '',
	              inner: new Exception()
	          })
	          new Exception(new TypeError('this is an error'))
	          new Exception(new AnotherException())
	  */
	function Exception(settings, inner) {
	  let _message = "";
	  let _code = undefined;
	  let _cause = undefined;
	  let _status = undefined;
	  let _host = undefined;
	  let _data = null;
	  let _stack = "";
	  let _stackTrace = null;
	  let _inner = null;
	  let _innerException;
	  let _date = new Date();
	  let _fileName = undefined;
	  let _lineNumber = undefined;
	  let _columnNumber = undefined;
	  let _name = this.constructor.name;
	  let _baseName = "";

	  if (isString(settings)) {
	    _message = settings;
	    _innerException = inner;
	  } else if (settings instanceof Error) {
	    const _settings = Object.assign({}, settings);

	    _cause = _settings.cause;
	    _message = settings.message;
	    _fileName = settings.fileName;
	    _lineNumber = settings.lineNumber;
	    _columnNumber = settings.columnNumber;
	    _baseName = settings.name;
	    _stack = settings.stack;
	    _innerException = inner;
	  } else if (isObject(settings)) {
	    const _settings = Object.assign({}, settings);

	    _message = isString(_settings.message) ? _settings.message : _message;
	    _code = isNumeric(_settings.code) ? _settings.code : _code;
	    _status = isString(_settings.status) ? _settings.status : _status;
	    _host = isString(_settings.host) ? _settings.host : _host;
	    _cause = _settings.cause;
	    _data = _settings.data;
	    _date = isDate(_settings.date) ? _settings.date : _date;
	    _stack = isString(_settings.stack) ? _settings.stack : _stack;
	    _fileName = isString(_settings.fileName) ? _settings.fileName : _fileName;
	    _lineNumber = isNumeric(_settings.lineNumber)? _settings.lineNumber: _lineNumber;
	    _columnNumber = isNumeric(_settings.columnNumber)? _settings.columnNumber: _columnNumber;
	    _baseName = isString(_settings.baseName) ? _settings.baseName : _baseName;
	    _innerException = _settings.innerException || inner;
	  } else {
	    _data = settings;
	    _innerException = inner;
	  }

	  if (_innerException) {
	    if (_innerException instanceof Exception) {
	      _inner = _innerException;
	    } else if (
	      _innerException instanceof Error ||
	      isObject(_innerException)
	    ) {
	      _inner = new Exception(_innerException);
	    } else if (isString(_innerException)) {
	      if (_innerException.indexOf(" ") > 0) {
	        _inner = new Exception({ message: _innerException });
	      } else {
	        _inner = new Exception({ status: _innerException });
	      }
	    } else if (isNumeric(_innerException)) {
	      _inner = new Exception({ code: _innerException });
	    } else {
	      throw `Exception.ctor: innerException must be a string, an object or instance of Error/Exception`;
	    }
	  }

	  if (isEmpty(_stack) && isFunction(Error.captureStackTrace)) {
	    try {
	      let temp = {};
	      Error.captureStackTrace(temp, Exception);
	      _stack = temp.stack;

	      if (_stack.startsWith("Error\n")) {
	        _stack = _message + "\n" + _stack.substr(7);
	      }
	    } catch {}
	  }

	  _stackTrace = isEmpty(_stack) ? null : new StackTrace(_stack);

	  const propertyIsReadOnly = (propertyName) => (value) => {
	    throw new PropertyReadOnlyException(propertyName, _host);
	  };

	  Object.defineProperties(this, {
	    name: {
	      enumerable: true,
	      get: function () {
	        return _name;
	      },
	      set: propertyIsReadOnly("Exception.name"),
	    },
	    baseName: {
	      enumerable: true,
	      get: function () {
	        return _baseName;
	      },
	      set: propertyIsReadOnly("Exception.baseName"),
	    },
	    code: {
	      enumerable: true,
	      get: function () {
	        return _code;
	      },
	      set: propertyIsReadOnly("Exception.code"),
	    },
	    cause: {
	      enumerable: true,
	      get: function () {
	        return _cause;
	      },
	      set: propertyIsReadOnly("Exception.cause"),
	    },
	    status: {
	      enumerable: true,
	      get: function () {
	        return _status;
	      },
	      set: propertyIsReadOnly("Exception.status"),
	    },
	    host: {
	      enumerable: true,
	      get: function () {
	        return _host;
	      },
	      set: propertyIsReadOnly("Exception.host"),
	    },
	    message: {
	      enumerable: true,
	      get: function () {
	        return _message;
	      },
	      set: propertyIsReadOnly("Exception.message"),
	    },
	    stack: {
	      enumerable: true,
	      get: function () {
	        return _stack;
	      },
	      set: propertyIsReadOnly("Exception.stack"),
	    },
	    stackTrace: {
	      enumerable: true,
	      get: function () {
	        return _stackTrace;
	      },
	      set: propertyIsReadOnly("Exception.stackTrace"),
	    },
	    innerException: {
	      enumerable: true,
	      get: function () {
	        return _inner;
	      },
	      set: propertyIsReadOnly("Exception.innerException"),
	    },
	    data: {
	      enumerable: true,
	      get: function () {
	        return _data;
	      },
	      set: propertyIsReadOnly("Exception.data"),
	    },
	    date: {
	      enumerable: true,
	      get: function () {
	        return _date;
	      },
	      set: propertyIsReadOnly("Exception.date"),
	    },
	    fileName: {
	      enumerable: true,
	      get: function () {
	        return _fileName;
	      },
	      set: propertyIsReadOnly("Exception.fileName"),
	    },
	    lineNumber: {
	      enumerable: true,
	      get: function () {
	        return _lineNumber;
	      },
	      set: propertyIsReadOnly("Exception.lineNumber"),
	    },
	    columnNumber: {
	      enumerable: true,
	      get: function () {
	        return _columnNumber;
	      },
	      set: propertyIsReadOnly("Exception.columnNumber"),
	    },
	  });
	}

	Exception.prototype.toString = function (separator = "\n") {
	  const arr = [];
	  let current = this;

	  while (current) {
	    arr.push(current.message);
	    current = current.innerException;
	  }

	  return arr.join(separator);
	};

	Exception.prototype.flatten = function () {
	  const arr = [];
	  let current = this;

	  while (current) {
	    arr.push(current);
	    current = current.innerException;
	  }

	  return arr;
	};

	class PropertyReadOnlyException extends Exception {
	  constructor(propertyName, host) {
	    super({
	      message: `property '${propertyName || "?"}' is read-only.`,
	      status: "property-readonly",
	      host,
	    });
	  }
	}

	class ArgumentNullOrUndefinedException extends Exception {
	  constructor(argName, host) {
	    super({
	      message: `argument '${argName || "?"}' cannot be null or undefined.`,
	      status: "argument-null-or-undefined",
	      host,
	    });
	    this.argName = argName;
	  }
	}
	class ArgumentTypeIncorrectException extends Exception {
	  constructor(argName, argType, type, host) {
	    super({
	      message: `argument '${
        argName || "?"
      }' has an incorrect type (${argType}). expected '${type}'.`,
	      status: "argument-type-incorrect",
	      host,
	    });
	    this.argName = argName;
	    this.argType = argType;
	    this.type = type;
	  }
	}

	function throwIfNullOrUndefined(arg, argName, host) {
	  if (isNullOrUndefined(arg)) {
	    throw new ArgumentNullOrUndefinedException(argName, host);
	  }
	}

	function throwIfTypeIncorrect(arg, argName, typeOrCheckType, host) {
	  let err;
	  let type;

	  if (isFunction(typeOrCheckType)) {
	    type = err = typeOrCheckType(arg);
	  } else if (isSomeString(typeOrCheckType)) {
	    type = typeOrCheckType;
	    let required = true;

	    if (type.endsWith("?")) {
	      required = false;
	      type = type.substr(0, type.length - 1);
	    }

	    if (required) {
	      throwIfNullOrUndefined(arg, argName, host);
	    }
	    
	    if (!isUndefined(arg)) {
	      switch (type) {
	        case "number":
	          err = !isNumber(arg);
	          break;
	        case "number+":
	          err = !isSomeNumber(arg);
	          break;
	        case "numeric":
	          err = !isNumeric(arg);
	          break;
	        case "int":
	        case "integer":
	          err = !isInteger(arg);
	          break;
	        case "int+":
	        case "integer+":
	          err = !(isInteger(arg) && arg == 0);
	          break;
	        case "float":
	          err = !isFloat(arg);
	          break;
	        case "float+":
	          err = !(isFloat(arg) && arg == 0);
	          break;
	        case "string":
	          err = !isString(arg);
	          break;
	        case "string+":
	          err = !isSomeString(arg);
	          break;
	        case "bool":
	          err = !isBool(arg);
	          break;
	        case "bool*":
	          err = !hasBool(arg);
	          break;
	        case "bool#":
	          err = !hasBool(arg, "pu");
	          break;
	        case "bool^":
	          err = !hasBool(arg, "p");
	          break;
	        case "bool!":
	          err = !hasBool(arg, "");
	          break;
	        case "array":
	          err = !isArray(arg);
	          break;
	        case "array+":
	          err = !isSomeArray(arg);
	          break;
	        case "object":
	          err = !isObject(arg);
	          break;
	        case "object+":
	          err = !isSomeObject(arg);
	          break;
	        case "date":
	          err = !isDate(arg);
	          break;
	        case "function":
	          err = !isFunction(arg);
	          break;
	        case "basic":
	          err = !isBasic(arg);
	          break;
	        case "primitive":
	          err = !isPrimitive(arg);
	          break;
	        default:
	          if (isObject(arg) && isFunction(arg.constructor)) {
	            err = arg.constructor.name != type;
	          } else {
	            err = typeof arg == type;
	          }
	  
	          break;
	      }
	    }
	  }

	  if (err) {
	    throw new ArgumentTypeIncorrectException(argName, typeof arg, type, host);
	  }
	}

	function throwIfNotArray(arg, argName, host) {
	  throwIfTypeIncorrect(arg, argName, "array", host);
	}

	const contains = function (arr, ...values) {
	  throwIfNotArray(arr, "arr");

	  const lastValue = values.length ? values[values.length - 1] : null;

	  let equalityComparer = isEqualityComparer(lastValue)
	    ? lastValue
	    : DefaultEqualityComparer;
	  let result = true;

	  for (let i = 0; i < values.length; i++) {
	    if (arr.findIndex((x) => equalityComparer.equals(x, values[i])) < 0) {
	      result = false;
	      break;
	    }
	  }

	  return result;
	};

	const formEachElement = function () {
	  let selector = "form";
	  let callback;
	  let hasCallback = false;
	  let hasExcludes = false;
	  let excludes;
	  let forms = null;
	  let temp;
	  let result = [];

	  function _setExcludes(arg) {
	    if (isFunction(arg)) {
	      excludes = arg;
	      hasExcludes = true;
	    } else {
	      if (isSomeString(arg)) {
	        arg = arg.split(",");
	      }

	      if (isArray(arg)) {
	        const classNames = arg.filter((x) => x && x[0] == ".");

	        excludes = (frm, el) => {
	          if (contains(arg, el.tagName)) {
	            return true;
	          }

	          for (let className of classNames) {
	            for (let elClassName of el.classList) {
	              if (elClassName == className.substr(1)) {
	                return true;
	              }
	            }
	          }

	          return false;
	        };

	        hasExcludes = true;
	      }
	    }
	  }

	  if (arguments.length > 0) {
	    temp = arguments[0];

	    if (isFunction(temp)) {
	      callback = temp;
	      hasCallback = true;
	    } else if (isSomeString(temp)) {
	      selector = temp;
	    } else if (isArray(temp)) {
	      selector = "";
	      forms = temp;
	    } else if (isSomeObject(temp)) {
	      selector = "";
	      forms = [temp];
	    }

	    if (arguments.length > 1) {
	      temp = arguments[1];

	      if (isFunction(temp)) {
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
	      for (let i = 0; i < forms.length; i++) {
	        let frm = forms[i];
	        let elements = frm && frm.elements;
	        let arr = [];

	        if (isEmpty(elements) || elements.length == 0) {
	          if (isFunction(frm.querySelectorAll)) {
	            elements = frm.querySelectorAll("input, select, textarea");
	          }
	        }

	        if (elements && elements.length) {
	          for (let j = 0; j < elements.length; j++) {
	            if (!hasExcludes || !excludes(frm, elements[j], j, i)) {
	              const r = callback(frm, elements[j], j, i);

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

	const NON_DATA_ENTRY_INPUT_TYPES = ["button", "submit", "reset", "image"];
	const NON_DATA_ENTRY_TAGS = ["button", "fieldset", "legend"];

	const isEditable = (el) => {
	  let result = false;

	  if (el) {
	    let _type = (el.type || "").toLowerCase();
	    let _tag = (el.tagName || "").toLowerCase();

	    result = !(
	      NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 ||
	      NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0
	    );
	  }

	  return result;
	};

	const formEach = (selector, callback, excludes) => {
		if (excludes == null) {
			excludes = (frm, el) => !isEditable(el);
		}
		
	    return formEachElement(selector, callback, excludes);
	};

	const disable = (selector, excludes, mode) =>
	  formEachElement(
	    selector,
	    (frm, el) => {
	      if (isBool(excludes) && isUndefined(mode)) {
	        mode = excludes;
	      }

	      el.disabled = isBool(mode) ? mode : true;
	    },
	    excludes
	  );
	const enable = (selector, excludes, mode) =>
	  formEachElement(
	    selector,
	    (frm, el) => {
	      if (isBool(excludes) && isUndefined(mode)) {
	        mode = excludes;
	      }

	      el.disabled = isBool(mode) ? !mode : false;
	    },
	    excludes
	  );
	const readOnly = (selector, excludes, mode) =>
	  formEach(
	    selector,
	    (frm, el) => {
	      if (isBool(excludes) && isUndefined(mode)) {
	        mode = excludes;
	      }

	      el.readOnly = isBool(mode) ? mode : true;
	    },
	    excludes
	  );
	const reset = (selector) =>
	  formEachElement(selector, (frm) => {
	    if (frm && isFunction(frm.reset)) {
	      frm.reset();
	    }
	  });
	const clear = (selector, excludes, includeHiddenFields = false) =>
	  formEach(
	    selector,
	    (frm, el, i) => {
	      let type = (el.type || "").toLowerCase();
	      (el.tagName || "").toLowerCase();

	      if (type == "checkbox" || type == "radio") {
	        el.checked = false;
	      } else if (type == "select") {
	        if (el.options && el.options.length) {
	          for (let opt of el.options) {
	            opt.selected = false;
	          }
	        }
	      } else if (type != "hidden" || includeHiddenFields) {
	        el.value = "";
	      }
	    },
	    excludes
	  );

	const has = (el, name) => {
	  let result = false;

	  const attrs = el.attributes;

	  if (el && el.attributes && el.attributes.length) {
	    for (let i = 0; i < attrs.length; i++) {
	      if (attrs[i].name.toLowerCase() == name) {
	        result = true;
	        break;
	      }
	    }
	  }

	  return result;
	};
	const hasValue = (el) => has(el, "value");

	const fromArray = (selector, obj, excludes) => {
	  if (isArray(obj)) {
	    let isArrayOfArray = true;

	    for (let i = 0; i < obj.length; i++) {
	      if (!isArray(obj[i])) {
	        isArrayOfArray = false;
	        break;
	      }
	    }

	    formEach(
	      selector,
	      (frm, el, i, j) => {
	        let _type = (el.type || "").toLowerCase();
	        let _tag = (el.tagName || "").toLowerCase();
	        let _name = el.name;
	        let _id = el.id;
	        let _key = _name || _id;

	        if (isEmpty(_key)) {
	          _key = i;
	        }

	        let data = isArrayOfArray ? obj[j] : obj;
	        let item = data.find((x) => x.name == _key);
	        let value;

	        if (item) {
	          value = item.value;
	        }

	        if (value != null) {
	          if (_type == "checkbox" || _type == "radio") {
	            if (isBool(value)) {
	              el.checked = value;
	            } else if (isArray(value)) {
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
	                    const els = frm.querySelectorAll('[name="' + _name + '"]');

	                    if (els && els.length) {
	                      for (let _i = 0; _i < els.length; _i++) {
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
	              if (isArray(value)) {
	                for (let ii = 0; ii < el.options.length; ii++) {
	                  el.options[ii].selected = contains(
	                    value,
	                    el.options[ii].value
	                  );
	                }
	              } else {
	                for (let ii = 0; ii < el.options.length; ii++) {
	                  el.options[ii].selected =
	                    el.options[ii].value == value || ii === value;
	                }
	              }
	            } else {
	              for (let ii = 0; ii < el.options.length; ii++) {
	                el.options[ii].selected =
	                  el.options[ii].value == value || ii === value;
	              }
	            }
	          } else {
	            el.value = value;
	          }
	        }
	      },
	      excludes
	    );
	  }
	};

	function _flatten(obj, separator = ".", prefix = "", result) {
	  if (isArray(obj)) {
	    result = [];

	    for (let item of obj) {
	      result.push(_flatten(item, separator));
	    }
	  } else if (isSomeObject(obj)) {
	    if (!result) {
	      result = {};
	    }

	    for (let key of Object.keys(obj)) {
	      let _prefix = prefix ? prefix + separator + key : key;
	      const value = obj[key];

	      if (isArray(value)) {
	        let r = [];

	        for (let item of value) {
	          r.push(_flatten(item, separator));
	        }

	        result[_prefix] = r;
	      } else if (isSomeObject(value)) {
	        _flatten(value, separator, _prefix, result);
	      } else {
	        result[_prefix] = value;
	      }
	    }
	  } else {
	    result = obj;
	  }

	  return result;
	}

	const flatten = function (obj, separator = ".") {
	  separator = isSomeString(separator) ? separator : ".";

	  let result = _flatten(obj, separator);

	  return result;
	};

	const unflatten = function (obj, separator = ".") {
	  let result;

	  separator = isSomeString(separator) ? separator : ".";

	  if (isArray(obj)) {
	    result = [];

	    for (let item of obj) {
	      result.push(unflatten(item, separator));
	    }
	  } else if (isSomeObject(obj)) {
	    result = {};

	    for (let key of Object.keys(obj)) {
	      let index = key.indexOf(separator);

	      if (index < 0) {
	        result[key] = unflatten(obj[key], separator);
	      } else {
	        let prevIndex = 0;
	        let prevObj = result;

	        while (index >= 0) {
	          let subKey = key.substring(prevIndex, index);

	          if (!prevObj[subKey]) {
	            prevObj[subKey] = {};
	          }

	          prevIndex = index + 1;
	          prevObj = prevObj[subKey];
	          index = key.indexOf(separator, index + 1);
	        }

	        prevObj[key.substr(prevIndex)] = unflatten(obj[key], separator);
	      }
	    }
	  } else {
	    result = obj;
	  }

	  return result;
	};

	const fromJson = (selector, obj, excludes, flattenProps) => {
	  if (isSomeObject(obj) || isArray(obj)) {
	    let checkboxes = [];

	    formEach(
	      selector,
	      (frm, el, i, j) => {
	        let _type = (el.type || "").toLowerCase();
	        let _tag = (el.tagName || "").toLowerCase();
	        let _name = el.name;
	        let _id = el.id;
	        let _key = _name || _id;

	        if (isEmpty(_key)) {
	          _key = i;
	        }

	        let form = isArray(obj) ? obj[j] : obj;

	        if (flattenProps) {
	          form = flatten(form);
	        }

	        let value = form && form[_key];

	        if (value != null) {
	          if (isSomeObject(value) && isSomeString(_key)) {
	            let dotIndex = _key.indexOf(".");
	            let prevIndex = 0;
	            let prevObj = value;

	            while (dotIndex >= 0) {
	              let subKey = _key.substring(prevIndex, dotIndex);

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
	              let item = checkboxes.find((x) => x.form == j && x.key == _key);

	              if (!item) {
	                item = { form: j, key: _key, count: 1 };

	                checkboxes.push(item);
	              } else {
	                item.count++;
	              }

	              if (isBool(value)) {
	                el.checked = value;
	              } else if (isArray(value)) {
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
	                    el.checked =
	                      item.count > 0 &&
	                      item.count <= value.length &&
	                      value[item.count - 1];
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
	                if (isArray(value)) {
	                  for (let ii = 0; ii < el.options.length; ii++) {
	                    el.options[ii].selected = contains(
	                      value,
	                      el.options[ii].value
	                    );
	                  }
	                } else {
	                  for (let ii = 0; ii < el.options.length; ii++) {
	                    el.options[ii].selected =
	                      el.options[ii].value == value || ii === value;
	                  }
	                }
	              } else {
	                for (let ii = 0; ii < el.options.length; ii++) {
	                  el.options[ii].selected =
	                    el.options[ii].value == value || ii === value;
	                }
	              }
	            } else {
	              el.value = value;
	            }
	          }
	        }
	      },
	      excludes
	    );
	  }
	};

	const getFormElements = function (form) {
	  let result = [];
	  let frm;

	  if (isSomeString(form)) {
	    frm = document.querySelector(form);
	  } else if (isArray(form)) {
	    frm = form.length ? form[0] : null;
	  } else if (isSomeObject(form)) {
	    frm = form.context ? form[0] : form;
	  }

	  if (!isEmpty(frm) && frm.elements && isIterable(frm.elements)) {
	    result = frm.elements;
	  }

	  return result;
	};

	const getValue = (form, key) => {
	  let result;

	  if (isSomeString(key)) {
	    let type;
	    let tag;
	    let name;
	    let count = 0;
	    let radio = false;
	    const _key = key.toLowerCase();
	    const elements = getFormElements(form);

	    result = [];

	    for (let el of elements) {
	      name = (el.name || "").toLowerCase();
	      type = (el.type || "").toLowerCase();
	      tag = (el.tagName || "").toLowerCase();

	      if (
	        _key == name ||
	        key == el.id ||
	        (key[0] == "#" && key.substr(1) == el.id)
	      ) {
	        count++;

	        if (type == "checkbox" || type == "radio") {
	          if (type == "radio") {
	            radio = true;
	          }

	          if (el.checked) {
	            result.push(el.value);
	          }
	        } else if (tag == "select") {
	          let subResult = [];

	          for (let j = 0; j < el.selectedOptions.length; j++) {
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

	    if (count == 1 || radio) {
	      result = result.length ? result[0] : "";
	    }
	  }

	  return result;
	};

	const setValue = (form, key, value) => {
	  if (isSomeString(key)) {
	    let type;
	    let tag;
	    let name;
	    const _key = key.toLowerCase();
	    const elements = getFormElements(form);
	    let _value = (value || "").toString().toLowerCase();

	    for (let el of elements) {
	      name = (el.name || "").toLowerCase();
	      type = (el.type || "").toLowerCase();
	      tag = (el.tagName || "").toLowerCase();

	      if (
	        _key == name ||
	        key == el.id ||
	        (key[0] == "#" && key.substr(1) == el.id)
	      ) {
	        if (type == "checkbox") {
	          if (isArray(value)) {
	            el.checked = contains(value, el.value);
	          } else {
	            el.checked = isBool(value)
	              ? value
	              : el.value.toLowerCase() == _value;
	          }
	        } else if (type == "radio") {
	          el.checked = isBool(value) ? value : el.value.toLowerCase() == _value;
	        } else if (tag == "select") {
	          for (let j = 0; j < el.options.length; j++) {
	            let opt = el.options[j];

	            if (isArray(value)) {
	              opt.selected =
	                contains(value, opt.value) || value.indexOf(j) >= 0;
	            } else {
	              opt.selected = opt.value == _value || j === value;
	            }
	          }
	        } else {
	          el.value = value;
	        }
	      }
	    }
	  }
	};

	const post = function () {
	  if (arguments.length) {
	    const options = {
	      action: "",
	      enctype: "",
	      target: "",
	      args: {},
	    };

	    const frm = document.createElement("FORM");

	    frm.method = "post";

	    if (isObject(arguments[0])) {
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

	    if (isSomeString(options.target)) {
	      frm.target = options.target;
	    }

	    if (isSomeString(options.enctype)) {
	      frm.enctype = options.enctype;
	    }

	    if (isSomeObject(options.args)) {
	      for (let key of Object.keys(options.args)) {
	        const input = document.createElement("input");

	        input.type = "hidden";
	        input.name = key;
	        input.value = options.args[key];

	        frm.appendChild(input);
	      }
	    }

	    let body = document.getElementsByTagName("body");

	    if (body && body.length) {
	      body = body[0];

	      body.appendChild(frm);

	      frm.submit();
	    }
	  }
	};

	const toArray = (selector, excludes) => {
	  let result = [];
	  let checkboxes = [];

	  formEach(
	    selector,
	    (frm, el, i, j) => {
	      if (result[j] == undefined) {
	        result[j] = [];
	      }

	      let _type = (el.type || "").toLowerCase();
	      let _tag = (el.tagName || "").toLowerCase();
	      let _name = el.name;
	      let _id = el.id;
	      let _key = _name || _id;

	      if (isEmpty(_key)) {
	        _key = i;
	      }

	      if (_type == "checkbox") {
	        let item = checkboxes.find((x) => x.form == j && x.key == _key);

	        if (!item) {
	          item = { form: j, key: _key, count: 1 };

	          checkboxes.push(item);
	        } else {
	          item.count++;
	        }

	        let index = -1;
	        let arr;

	        for (let ii = 0; ii < result[j].length; ii++) {
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
	              result[j].push({ name: _key, value: [el.value] });
	            } else {
	              result[j].push({ name: _key, value: [true] });
	            }
	          }
	        }
	      } else if (_type == "radio") {
	        if (el.checked) {
	          if (hasValue(el)) {
	            result[j].push({ name: _key, value: el.value });
	          } else {
	            result[j].push({ name: _key, value: true });
	          }
	        }
	      } else if (_tag == "select") {
	        if (el.multiple) {
	          let temp = [];

	          for (let ii = 0; ii < el.selectedOptions.length; ii++) {
	            temp.push(el.selectedOptions[ii].value);
	          }

	          result[j].push({ name: _key, value: temp });
	        } else {
	          if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
	            result[j].push({
	              name: _key,
	              value: el.options[el.selectedIndex]
	                ? el.options[el.selectedIndex].value
	                : undefined,
	            });
	          } else {
	            result[j].push({ name: _key, value: undefined });
	          }
	        }
	      } else {
	        result[j].push({ name: _key, value: el.value });
	      }
	    },
	    excludes
	  );

	  if (result.length == 0) {
	    return [];
	  } else {
	    if (checkboxes.length > 0) {
	      for (let item of checkboxes) {
	        if (item.count == 1) {
	          let e = result[item.form].find((x) => x.name == item.key);

	          if (e && e.value.length == 1) {
	            e.value = e.value[0];
	          }
	        }
	      }
	    }

	    if (result.length == 1) {
	      return result[0];
	    }
	  }

	  return result;
	};

	const toJson = (selector, excludes, expandNames) => {
	    let result = [];
		let checkboxes = [];
		
	    formEach(selector, (frm, el, i, j) => {
	        if (result[j] == undefined) {
	            result[j] = {};
	        }

	        let _type = (el.type || '').toLowerCase();
	        let _tag = (el.tagName || '').toLowerCase();
	        let _name = el.name;
	        let _id = el.id;
	        let _key = _name || _id;

	        if (isEmpty(_key)) {
	            _key = i;
	        }

	        if (_type == 'checkbox') {
				if (!isArray(result[j][_key])) {
					result[j][_key] = [];
				}

				let item = checkboxes.find(x => x.form == j && x.key == _key);
				
				if (!item) {
					item = { form: j, key: _key, count: 1 };
					
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
					
					for (let ii = 0; ii < el.selectedOptions.length; ii++) {
						result[j][_key].push(el.selectedOptions[ii].value);
					}
				} else {
					if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
						result[j][_key] = el.options[el.selectedIndex] ? el.options[el.selectedIndex].value: undefined;
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
				for (let item of checkboxes) {
					if (item.count == 1) {
						if (result[item.form][item.key].length == 1) {
							result[item.form][item.key] = result[item.form][item.key][0];
						} else {
							result[item.form][item.key] = false;
						}
					}
				}
			}
			
			if (expandNames) {
				result = unflatten(result);
			}
			
			if (result.length == 1) {
				result = result[0];
			}
		}
		
		return result;
	};

	class Form {
	  constructor(selector) {
	    this._form = document.querySelector(selector);
	  }
	  get instance() {
	    return this._form;
	  }
	  set instance(value) {
	    this._form = value;
	  }
	  each(callback, excludes) {
	    return formEach(this.instance, callback, excludes);
	  }
	  eachElement(callback, excludes) {
	    return formEachElement(this.instance, callback, excludes);
	  }
	  enable(...args) {
	    enable(this.instance, ...args);
	  }
	  disable(...args) {
	    disable(this.instance, ...args);
	  }
	  readOnly(...args) {
	    readOnly(this.instance, ...args);
	  }
	  clear(...args) {
	    clear(this.instance, ...args);
	  }
	  reset() {
	    reset(this.instance);
	  }
	  fromJson(...args) {
	    fromJson(this.instance, ...args);
	  }
	  toJson() {
	    return toJson(this.instance);
	  }
	  fromArray(...args) {
	    fromArray(this.instance, ...args);
	  }
	  toArray() {
	    return toArray(this.instance);
	  }
	  getValue(key) {
	    return getValue(this.instance, key);
	  }
	  setValue(key, value) {
	    setValue(this.instance, key, value);
	  }

	  static each(...args) {
	    return formEach(...args);
	  }
	  static eachElement(...args) {
	    return formEachElement(...args);
	  }
	  static enable(...args) {
	    enable(...args);
	  }
	  static disable(...args) {
	    disable(...args);
	  }
	  static readOnly(...args) {
	    readOnly(...args);
	  }
	  static clear(...args) {
	    clear(...args);
	  }
	  static reset(...args) {
	    reset(...args);
	  }
	  static fromJson(...args) {
	    fromJson(...args);
	  }
	  static toJson(...args) {
	    return toJson(...args);
	  }
	  static fromArray(...args) {
	    fromArray(...args);
	  }
	  static toArray(...args) {
	    return toArray(...args);
	  }
	  static getValue(...args) {
	    return getValue(...args);
	  }
	  static setValue(...args) {
	    setValue(...args);
	  }
	}

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

}));
