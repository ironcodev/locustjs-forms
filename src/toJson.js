import { isEmpty, isArray } from "@locustjs/base";
import { unflatten } from "@locustjs/extensions-object";
import formEach from "./formEach";
import { has, hasValue } from "./hasValue";

const toJson = (selector, excludes, expandNames) => {
  let result = [];
  let checkboxes = [];

  formEach(
    selector,
    ({ element, index, formIndex }) => {
      if (result[formIndex] == undefined) {
        result[formIndex] = {};
      }

      let _type = (element.type || "").toLowerCase();
      let _tag = (element.tagName || "").toLowerCase();
      let _name = element.name;
      let _id = element.id;
      let _key = _name || _id;

      if (isEmpty(_key)) {
        _key = index;
      }

      if (_type == "checkbox") {
        if (!isArray(result[formIndex][_key])) {
          result[formIndex][_key] = [];
        }

        let item = checkboxes.find((x) => x.form == formIndex && x.key == _key);

        if (!item) {
          item = { form: formIndex, key: _key, count: 1 };

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

          for (let ii = 0; ii < element.selectedOptions.length; ii++) {
            result[formIndex][_key].push(element.selectedOptions[ii].value);
          }
        } else {
          if (
            element.selectedIndex >= 0 &&
            element.selectedIndex < element.options.length
          ) {
            result[formIndex][_key] = element.options[element.selectedIndex]
              ? element.options[element.selectedIndex].value
              : undefined;
          } else {
            result[formIndex][_key] = undefined;
          }
        }
      } else if (_tag == "button") {
        result[formIndex][_key] = element.innerText;
      } else {
        result[formIndex][_key] = element.value;
      }
    },
    excludes
  );

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

export default toJson;
