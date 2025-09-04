import { isEmpty, isArray } from '@locustjs/base';
import { unflatten } from '@locustjs/extensions-object';
import formEach from './formEach';
import { has, hasValue } from './hasValue';

const toJson = (selector, excludes, expandNames) => {
    let result = [];
	let checkboxes = [];
	
    formEach(selector, (frm, el, i, j) => {
        if (result[j] == undefined) {
            result[j] = {};
        }

        let _type = (el.type || '').toLowerCase();
        let _tag = (el.tagName || '').toLowerCase();
        let _name = el.name;
        let _id = el.id;
        let _key = _name || _id;

        if (isEmpty(_key)) {
            _key = i;
        }

        if (_type == 'checkbox') {
			if (!isArray(result[j][_key])) {
				result[j][_key] = [];
			}

			let item = checkboxes.find(x => x.form == j && x.key == _key);
			
			if (!item) {
				item = { form: j, key: _key, count: 1 };
				
				checkboxes.push(item);
			} else {
				item.count++;
			}
			
			if (el.checked) {
				if (hasValue(el)) {
					result[j][_key].push(el.value);
				} else {
					result[j][_key].push(true);
				}
			} else {
				if (!hasValue(el)) {
					result[j][_key].push(false);
				} else if (!has(el, "name")) {
					result[j][_key].push("");
				}
			}
		} else if (_type == 'radio') {
			if (el.checked) {
				if (hasValue(el)) {
					result[j][_key] = el.value;
				} else {
					result[j][_key] = true;
				}
			}
        } else if (_tag == 'select') {
			if (el.multiple) {
				result[j][_key] = [];
				
				for (let ii = 0; ii < el.selectedOptions.length; ii++) {
					result[j][_key].push(el.selectedOptions[ii].value);
				}
			} else {
				if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
					result[j][_key] = el.options[el.selectedIndex] ? el.options[el.selectedIndex].value: undefined;
				} else {
					result[j][_key] = undefined;
				}
			}
        } else if (_tag == 'button') {
			result[j][_key] = el.innerText;
        } else {
            result[j][_key] = el.value;
        }
    }, excludes);

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