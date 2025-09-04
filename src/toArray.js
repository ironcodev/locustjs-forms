import { isEmpty } from "@locustjs/base";
import formEach from "./formEach";
import { hasValue } from "./hasValue";

const toArray = (selector, excludes) => {
  let result = [];
  let checkboxes = [];

  formEach(
    selector,
    (frm, el, i, j) => {
      if (result[j] == undefined) {
        result[j] = [];
      }

      let _type = (el.type || "").toLowerCase();
      let _tag = (el.tagName || "").toLowerCase();
      let _name = el.name;
      let _id = el.id;
      let _key = _name || _id;

      if (isEmpty(_key)) {
        _key = i;
      }

      if (_type == "checkbox") {
        let item = checkboxes.find((x) => x.form == j && x.key == _key);

        if (!item) {
          item = { form: j, key: _key, count: 1 };

          checkboxes.push(item);
        } else {
          item.count++;
        }

        let index = -1;
        let arr;

        for (let ii = 0; ii < result[j].length; ii++) {
          if (result[j][ii].name == _key) {
            index = ii;
            break;
          }
        }

        if (index >= 0) {
          arr = result[j][index].value;
        }

        if (el.checked) {
          if (arr) {
            if (hasValue(el)) {
              arr.push(el.value);
            } else {
              arr.push(true);
            }
          } else {
            if (hasValue(el)) {
              result[j].push({ name: _key, value: [el.value] });
            } else {
              result[j].push({ name: _key, value: [true] });
            }
          }
        }
      } else if (_type == "radio") {
        if (el.checked) {
          if (hasValue(el)) {
            result[j].push({ name: _key, value: el.value });
          } else {
            result[j].push({ name: _key, value: true });
          }
        }
      } else if (_tag == "select") {
        if (el.multiple) {
          let temp = [];

          for (let ii = 0; ii < el.selectedOptions.length; ii++) {
            temp.push(el.selectedOptions[ii].value);
          }

          result[j].push({ name: _key, value: temp });
        } else {
          if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
            result[j].push({
              name: _key,
              value: el.options[el.selectedIndex]
                ? el.options[el.selectedIndex].value
                : undefined,
            });
          } else {
            result[j].push({ name: _key, value: undefined });
          }
        }
      } else {
        result[j].push({ name: _key, value: el.value });
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
