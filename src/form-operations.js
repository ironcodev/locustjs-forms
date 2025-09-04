import { isBool, isFunction, isUndefined } from "@locustjs/base";
import formEach from "./formEach";
import formEachElement from "./formEachElement";

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
      let tag = (el.tagName || "").toLowerCase();

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

export { disable, enable, readOnly, reset, clear };
