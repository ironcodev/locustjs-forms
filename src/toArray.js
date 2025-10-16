import { isEmpty } from "@locustjs/base";
import formEach from "./formEach";
import { hasValue } from "./hasValue";

const toArray = (selector, excludes) => {
  let result = [];
  let checkboxes = [];

  formEach(
    selector,
    ({ element, index, formIndex }) => {
      if (result[formIndex] == undefined) {
        result[formIndex] = [];
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
        let item = checkboxes.find((x) => x.form == formIndex && x.key == _key);

        if (!item) {
          item = { form: formIndex, key: _key, count: 1 };

          checkboxes.push(item);
        } else {
          item.count++;
        }

        let _index = -1;
        let arr;

        for (let ii = 0; ii < result[formIndex].length; ii++) {
          if (result[formIndex][ii].name == _key) {
            _index = ii;
            break;
          }
        }

        if (_index >= 0) {
          arr = result[formIndex][_index].value;
        }

        if (element.checked) {
          if (arr) {
            if (hasValue(element)) {
              arr.push(element.value);
            } else {
              arr.push(true);
            }
          } else {
            if (hasValue(element)) {
              result[formIndex].push({ name: _key, value: [element.value] });
            } else {
              result[formIndex].push({ name: _key, value: [true] });
            }
          }
        }
      } else if (_type == "radio") {
        if (element.checked) {
          if (hasValue(element)) {
            result[formIndex].push({ name: _key, value: element.value });
          } else {
            result[formIndex].push({ name: _key, value: true });
          }
        }
      } else if (_tag == "select") {
        if (element.multiple) {
          let temp = [];

          for (let ii = 0; ii < element.selectedOptions.length; ii++) {
            temp.push(element.selectedOptions[ii].value);
          }

          result[formIndex].push({ name: _key, value: temp });
        } else {
          if (
            element.selectedIndex >= 0 &&
            element.selectedIndex < element.options.length
          ) {
            result[formIndex].push({
              name: _key,
              value: element.options[element.selectedIndex]
                ? element.options[element.selectedIndex].value
                : undefined,
            });
          } else {
            result[formIndex].push({ name: _key, value: undefined });
          }
        }
      } else {
        result[formIndex].push({ name: _key, value: element.value });
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

export default toArray;
