import { isEmpty, isArray, isBool } from "@locustjs/base";
import { contains } from "@locustjs/extensions-array";
import formEach from "./formEach";
import { hasValue } from "./hasValue";

const fromArray = (selector, arr, excludes) => {
  if (isArray(arr)) {
    let isArrayOfArray = true;

    for (let i = 0; i < arr.length; i++) {
      if (!isArray(arr[i])) {
        isArrayOfArray = false;
        break;
      }
    }

    formEach(
      selector,
      ({ form, element, index, formIndex }) => {
        let _type = (element.type || "").toLowerCase();
        let _tag = (element.tagName || "").toLowerCase();
        let _name = element.name;
        let _id = element.id;
        let _key = _name || _id;

        if (isEmpty(_key)) {
          _key = index;
        }

        let data = isArrayOfArray ? arr[formIndex] : arr;
        let item = data.find((x) => x.name == _key);
        let value;

        if (item) {
          value = item.value;
        }

        if (value != null) {
          if (_type == "checkbox" || _type == "radio") {
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
                  if (_name && form.querySelectorAll) {
                    const els = form.querySelectorAll('[name="' + _name + '"]');

                    if (els && els.length) {
                      for (let _i = 0; _i < els.length; _i++) {
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
      },
      excludes
    );
  }
};

export default fromArray;
