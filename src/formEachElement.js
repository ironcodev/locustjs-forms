import {
  isSomeString,
  isSomeObject,
  isEmpty,
  isFunction,
  isArray,
} from "@locustjs/base";
import { contains } from "@locustjs/extensions-array";

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

        excludes = ({ element }) => {
          if (contains(arg, element.tagName)) {
            return true;
          }

          for (let className of classNames) {
            for (let elClassName of element.classList) {
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
            const args = {
              form: frm,
              element: elements[j],
              index: j,
              formIndex: i,
            };

            if (!hasExcludes || !excludes(args)) {
              const r = callback(args);

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

export default formEachElement;
