import { isEmpty, isArray, isBool } from "@locustjs/base";
import { contains } from "@locustjs/extensions-array";
import formEach from "./formEach";
import { hasValue } from "./hasValue";

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

export default fromArray;
