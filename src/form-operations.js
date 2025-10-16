import {
  forEach,
  isBool,
  isFunction,
  isObject,
  isSomeString,
  isUndefined,
} from "@locustjs/base";
import formEach from "./formEach";
import formEachElement from "./formEachElement";

const _preventDefault = (e) => e.preventDefault();

class FormElementReadOnlyStrategyBase {
  readOnly(element, mode) {
    throw `${this.constructor.name}.readOnly() is not implemented`;
  }
}

class FormElementReadOnlyByAttribute extends FormElementReadOnlyStrategyBase {
  readOnly(element, mode) {
    if (element) {
      const tag = (element.tagName || "").toLowerCase();
      const type = (element.type || "").toLowerCase();

      if (
        (tag == "input" || tag == "textarea") &&
        type != "checkbox" &&
        type != "radio" &&
        type != "range" &&
        type != "color" &&
        type != "file" &&
        type != "button" &&
        type != "hidden"
      ) {
        element.readOnly = isBool(mode) ? mode : true;

        return true;
      }
    }

    return false;
  }
}

class FormElementReadOnlyByJavascript extends FormElementReadOnlyByAttribute {
  readOnly(element, mode) {
    if (!super.readOnly(element, mode)) {
      const readOnly = isBool(mode) ? mode : true;

      if (readOnly) {
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
}

class FormElementReadOnlyByCss extends FormElementReadOnlyByAttribute {
  static readonlyCssClassName = ".locust-forms-readonly";
  static readonlyCssStyle = {
    "pointer-events": "none",
    opacity: "1",
  };
  _isSelectorDefined(selector) {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === selector) {
            return true;
          }
        }
      } catch (e) {
        // Some stylesheets may be cross-origin and throw errors
        continue;
      }
    }

    return false;
  }
  _addReadOnlyCssRule(selector) {
    if (
      document &&
      isFunction(document.createElement) &&
      !this._isSelectorDefined(selector)
    ) {
      const style = document.createElement("style");
      const arr = [];

      forEach(FormElementReadOnlyByCss.readonlyCssStyle, ({ key, value }) =>
        arr.push(`${key}: ${value};`)
      );

      style.textContent = `${selector} {
    ${arr.join("\n")}
  }`;
      document.head.appendChild(style);
    }
  }
  readOnly(element, mode) {
    if (!super.readOnly(element, mode)) {
      this._addReadOnlyCssRule(FormElementReadOnlyByCss.readonlyCssClassName);

      const readOnly = isBool(mode) ? mode : true;
      const readOnlyClassName =
        FormElementReadOnlyByCss.readonlyCssClassName.substr(1);

      if (readOnly) {
        element.classList.add(readOnlyClassName);
      } else {
        element.classList.remove(readOnlyClassName);
      }
    }

    return true;
  }
}

class FormElementReadOnlyFactory {
  static js = new FormElementReadOnlyByJavascript();
  static attr = new FormElementReadOnlyByAttribute();
  static css = new FormElementReadOnlyByCss();
  static def = FormElementReadOnlyFactory.css;

  static getStrategy(value) {
    let result = FormElementReadOnlyFactory.def;

    if (value) {
      if (isObject(value)) {
        if (isFunction(value.readOnly)) {
          result = value;
        }
      } else if (isSomeString(value)) {
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
}

const disable = (selector, excludes, mode) => {
  if (isBool(excludes) && isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }

  return formEachElement(
    selector,
    ({ element }) => {
      element.disabled = isBool(mode) ? mode : true;
    },
    excludes
  );
};
const enable = (selector, excludes, mode) => {
  if (isBool(excludes) && isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }

  return formEachElement(
    selector,
    ({ element }) => {
      element.disabled = isBool(mode) ? !mode : false;
    },
    excludes
  );
};
const readOnly = (selector, excludes, mode, readOnlyStrategy) => {
  if (isBool(excludes) && isUndefined(mode)) {
    mode = excludes;
    excludes = "";
  }

  return formEach(
    selector,
    ({ element }) => {
      const rs = FormElementReadOnlyFactory.getStrategy(readOnlyStrategy);

      rs.readOnly(element, mode);
    },
    excludes
  );
};
const reset = (selector) =>
  formEachElement(selector, ({ form }) => {
    if (form && isFunction(form.reset)) {
      form.reset();
    }
  });
const clear = (selector, excludes, includeHiddenFields = false) =>
  formEach(
    selector,
    ({ element }) => {
      let type = (element.type || "").toLowerCase();
      let tag = (element.tagName || "").toLowerCase();

      if (type == "checkbox" || type == "radio") {
        element.checked = false;
      } else if (type == "select") {
        if (element.options && element.options.length) {
          for (let opt of element.options) {
            opt.selected = false;
          }
        }
      } else if (type != "hidden" || includeHiddenFields) {
        element.value = "";
      }
    },
    excludes
  );

export {
  disable,
  enable,
  readOnly,
  reset,
  clear,
  FormElementReadOnlyStrategyBase,
  FormElementReadOnlyByAttribute,
  FormElementReadOnlyByJavascript,
  FormElementReadOnlyByCss,
  FormElementReadOnlyFactory,
};
