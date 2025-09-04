import {
  isSomeString,
  isSomeObject,
  isEmpty,
  isArray,
  isBool,
  isIterable,
} from "@locustjs/base";
import { contains } from "@locustjs/extensions-array";

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

export { getValue, setValue };
