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

export default fromJson;
