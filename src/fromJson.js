import {
  isSomeString,
  isSomeObject,
  isEmpty,
  isArray,
  isBool,
} from "@locustjs/base";
import { contains } from "@locustjs/extensions-array";
import { flatten } from "@locustjs/extensions-object";
import formEach from "./formEach";
import { hasValue } from "./hasValue";

const fromJson = (selector, obj, excludes, flattenProps) => {
  if (isSomeObject(obj) || isArray(obj)) {
    let checkboxes = [];

    formEach(
      selector,
      ({ element, index, formIndex }) => {
        let _type = (element.type || "").toLowerCase();
        let _tag = (element.tagName || "").toLowerCase();
        let _name = element.name;
        let _id = element.id;
        let _key = _name || _id;

        if (isEmpty(_key)) {
          _key = index;
        }

        let frm = isArray(obj) ? obj[formIndex] : obj;

        if (flattenProps) {
          frm = flatten(frm);
        }

        let value = frm && frm[_key];

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
              let item = checkboxes.find(
                (x) => x.form == formIndex && x.key == _key
              );

              if (!item) {
                item = { form: formIndex, key: _key, count: 1 };

                checkboxes.push(item);
              } else {
                item.count++;
              }

              if (isBool(value)) {
                element.checked = value;
              } else if (isArray(value)) {
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
                    element.checked =
                      item.count > 0 &&
                      item.count <= value.length &&
                      value[item.count - 1];
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
                if (isArray(value)) {
                  for (let ii = 0; ii < element.options.length; ii++) {
                    element.options[ii].selected = contains(
                      value,
                      element.options[ii].value
                    );
                  }
                } else {
                  for (let ii = 0; ii < element.options.length; ii++) {
                    element.options[ii].selected =
                      element.options[ii].value == value || ii === value;
                  }
                }
              } else {
                for (let ii = 0; ii < element.options.length; ii++) {
                  element.options[ii].selected =
                    element.options[ii].value == value || ii === value;
                }
              }
            } else {
              element.value = value;
            }
          }
        }
      },
      excludes
    );
  }
};

export default fromJson;
