import { isSomeString, isObject, isSomeObject, isEmpty, isFunction, isArray, isBool } from '@locustjs/base';
import { contains } from '@locustjs/extensions-array';
import { flatten, unflatten } from '@locustjs/extensions-object';

const formEachElement = function () {
	let selector = 'form';
	let callback;
	let hasCallback = false;
	let hasExcludes = false;
	let excludes;
	let forms = null;
	let temp;
	let result = [];
	
	function _setExcludes(arg) {
		if (isFunction(arg)) {
			excludes = arg;
			hasExcludes = true;
		} else {
			if (isSomeString(arg)) {
				arg = arg.split(',');
			}
			
			if (isArray(arg)) {
				const classNames = arg.filter(x => x && x[0] == '.');
				
				excludes = (frm, el) => {
					if (contains(arg, el.tagName)) {
						return true;
					}
					
					for (let className of classNames) {
						for (let elClassName of el.classList) {
							if (elClassName == className.substr(1)) {
								return true;
							}
						}
					}
					
					return false;
				};
				
				hasExcludes = true;
			}
		}
	}
	
	if (arguments.length > 0) {
		temp = arguments[0];
		
		if (isFunction(temp)) {
			callback = temp;
			hasCallback = true;
		} else if (isSomeString(temp)) {
			selector = temp;
		} else if (isArray(temp)) {
			selector = '';
			forms = temp;
		} else if (isSomeObject(temp)) {
			selector = '';
			forms = [ temp ];
		}
		
		if (arguments.length > 1) {
			temp = arguments[1];
			
			if (isFunction(temp)) {
				if (hasCallback) {
					_setExcludes(temp);
				} else {
					callback = temp;
					hasCallback = true;
				}
			} else if (hasCallback) {
				 _setExcludes(temp);
			}
			
			if (arguments.length > 2) {
				temp = arguments[2];
				
				_setExcludes(temp);
			}
		}
	}
    
    if (hasCallback) {
		if (selector) {
			forms = document.querySelectorAll(selector);
		}

		if (!isEmpty(forms) && forms.length) {
			for (let i = 0; i < forms.length; i++) {
				let frm = forms[i];
				let elements = frm && frm.elements;
				let arr = [];
				
				if (isEmpty(elements) || elements.length == 0) {
					elements = frm.querySelectorAll('input, select, textarea');
				}
				
				if (!isEmpty(elements) && elements.length) {
					for (let j = 0; j < elements.length; j++) {
						if (!hasExcludes || !excludes(frm, elements[j], j, i)) {
							const r = callback(frm, elements[j], j, i);
							
							arr.push(r);
						}
					}
				}
				
				result.push(arr);
			}
		}
	}
	
	return result;
}

const NON_DATA_ENTRY_INPUT_TYPES = ['button', 'submit', 'reset', 'image'];
const NON_DATA_ENTRY_TAGS = ['button', 'fieldset', 'legend'];

const isEditable = el => {
	let _type = (el.type || '').toLowerCase();
	let _tag = (el.tagName || '').toLowerCase();
	
	const result = !(NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 || NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0);
	
	return result;
}

const formEach = (selector, callback, excludes) => {
	if (excludes == null) {
		excludes = (frm, el) => !isEditable(el);
	}
	
    return formEachElement(selector, callback, excludes);
}

const disableForm = (selector, value = true) => formEachElement(selector, (frm, el) => el.disabled = value);
const enableForm = (selector, value = true) => formEachElement(selector, (frm, el) => el.disabled = !value);
const readOnlyForm = (selector, value = true) => formEach(selector, (frm, el) => el.readOnly = value);
const unreadOnlyForm = (selector, value = true) => formEach(selector, (frm, el) => el.readOnly = !value);
const resetForm = (selector) => formEachElement(selector, frm => frm.reset());
const clearForm = (selector) => formEach(selector, (frm, el, i) => {
    let type = (el.type || '').toLowerCase();
    let tag = (el.tagName || '').toLowerCase();

    if (type == 'checkbox' || type == 'radio') {
        el.checked = false;
    } else if (type == 'select') {
		if (el.options && el.options.length) {
			for (let opt of el.options) {
				opt.selected = false;
			}
		}
    } else if (type != 'hidden') {
        el.value = '';
    }
});

const hasValue = el => {
	const attrs = el.attributes;
	
	for (let i = 0; i < attrs.length; i++) {
		if (attrs[i].name.toLowerCase() == 'value') {
			return true;
		}
	}
	
	return false;
}

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
const fromJson = (selector, obj, excludes, flattenProps) => {
    if (isSomeObject(obj) || isArray(obj)) {
		let checkboxes = [];
		
        formEach(selector, (frm, el, i, j) => {
            let _type = (el.type || '').toLowerCase();
            let _tag = (el.tagName || '').toLowerCase();
            let _name = el.name;
            let _id = el.id;
            let _key = _name || _id;

            if (isEmpty(_key)) {
                _key = i;
            }

            let form = isArray(obj) ? obj[j]: obj;
			
			if (flattenProps) {
				form = flatten(form)
			}
			
            let value = form && form[_key];

            if (value != null) {
				if (isSomeObject(value) && isSomeString(_key)) {
					let dotIndex = _key.indexOf('.');
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
						dotIndex = _key.indexOf('.', dotIndex + 1);
					}
					
					value = prevObj ? prevObj[_key.substr(prevIndex)] : null;
				}
				
				if (value != null) {
					if ((_type == 'checkbox' || _type == 'radio')) {
						let item = checkboxes.find(x => x.form == j && x.key == _key);
				
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
									el.checked = item.count > 0 && item.count <= value.length && value[item.count - 1];
								}
							}
						} else {
							if (hasValue(el)) {
								el.checked = el.value == value;
							} else {
								el.checked = value;
							}
						}
					} else if (_tag == 'select') {
						if (el.multiple) {
							if (isArray(value)) {
								for (let ii = 0; ii < el.options.length; ii++) {
									el.options[ii].selected = contains(value, el.options[ii].value);
								}
							} else {
								for (let ii = 0; ii < el.options.length; ii++) {
									el.options[ii].selected = el.options[ii].value == value || ii === value;
								}
							}
						} else {
							for (let ii = 0; ii < el.options.length; ii++) {
								el.options[ii].selected = el.options[ii].value == value || ii === value;
							}
						}
					} else {
						el.value = value;
					}
				}
            }
        }, excludes);
    }
};
const toArray = (selector, excludes) => {
    let result = [];
	let checkboxes = [];
	
    formEach(selector, (frm, el, i, j) => {
        if (result[j] == undefined) {
            result[j] = [];
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
			let item = checkboxes.find(x => x.form == j && x.key == _key);
					
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
						result[j].push({ name: _key, value: [ el.value ] });
					} else {
						result[j].push({ name: _key, value: [ true ] });
					}
				}
            }
		} else if (_type == 'radio') {
			if (el.checked) {
				if (hasValue(el)) {
					result[j].push({ name: _key, value: el.value });
				} else {
					result[j].push({ name: _key, value: true });
				}
			}
        } else if (_tag == 'select') {
			if (el.multiple) {
				let temp = [];
				
				for (let ii = 0; ii < el.selectedOptions.length; ii++) {
					temp.push(el.selectedOptions[ii].value);
				}
				
				result[j].push({ name: _key, value: temp });
			} else {
				if (el.selectedIndex >= 0 && el.selectedIndex < el.options.length) {
					result[j].push({ name: _key, value: el.options[el.selectedIndex] ? el.options[el.selectedIndex].value: undefined });
				} else {
					result[j].push({ name: _key, value: undefined });
				}
			}
        } else {
            result[j].push({ name: _key, value: el.value });
        }
    }, excludes);

    if (result.length == 0) {
        return [];
    } else {
		if (checkboxes.length > 0) {
			for (let item of checkboxes) {
				if (item.count == 1) {
					let e = result[item.form].find(x => x.name == item.key);
					
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
const fromArray = (selector, obj, excludes) => {
    if (isArray(obj)) {
		let isArrayOfArray = true;
		
		for (let i = 0; i < obj.length; i++) {
			if (!isArray(obj[i])) {
				isArrayOfArray = false;
				break;
			}
		}
		
        formEach(selector, (frm, el, i, j) => {
            let _type = (el.type || '').toLowerCase();
            let _tag = (el.tagName || '').toLowerCase();
            let _name = el.name;
            let _id = el.id;
            let _key = _name || _id;

            if (isEmpty(_key)) {
                _key = i;
            }

            let data = isArrayOfArray ? obj[j]: obj;
            let item = data.find(x => x.name == _key);
            let value;
            
            if (item) {
				value = item.value;
            }

            if (value != null) {
                if ((_type == 'checkbox' || _type == 'radio')) {
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
                } else if (_tag == 'select') {
					if (el.multiple) {
						if (isArray(value)) {
							for (let ii = 0; ii < el.options.length; ii++) {
								el.options[ii].selected = contains(value, el.options[ii].value);
							}
						} else {
							for (let ii = 0; ii < el.options.length; ii++) {
								el.options[ii].selected = el.options[ii].value == value || ii === value;
							}
						}
					} else {
						for (let ii = 0; ii < el.options.length; ii++) {
							el.options[ii].selected = el.options[ii].value == value || ii === value;
						}
					}
                } else {
                    el.value = value;
                }
            }
        }, excludes);
    }
};
const post = function () {
	if (arguments.length) {
		const options = {
			action: '',
			enctype: '',
			target: '',
			args: {}
		}
		
		const frm = document.createElement('FORM');
		
		frm.method = 'post';
		
		if (isObject(arguments[0])) {
			options.action = arguments[0].url || arguments[0].action;
			options.args = arguments[0].args || arguments[0].params;
			options.target = arguments[0].target;
			options.enctype = arguments[0].enctype;
		} else {
			options.action = arguments[0];
			options.args = arguments.length > 1 ? arguments[1]: {};
			options.target = arguments.length > 2 ? arguments[2]: '';
			options.enctype = arguments.length > 3 ? arguments[3]: '';
		}
		
		frm.action = options.action;
		
		if (isSomeString(options.target)) {
			frm.target = options.target;
		}
		
		if (isSomeString(options.enctype)) {
			frm.enctype = options.enctype;
		}
		
		if (isSomeObject(options.args)) {
			for (let key of Object.keys(options.args)) {
				const input = document.createElement('input');
				
				input.type = 'hidden';
				input.name = key;
				input.value = options.args[key];
				
				frm.appendChild(input);
			}
		}
		
		let body = document.getElementsByTagName('body');
		
		if (body && body.length) {
			body = body[0];
			
			body.appendChild(frm);
			
			frm.submit();
		}
	}
}

const getValue = (form, key) => {
	let frm;
	let el;
	let type;
	let tag;
	let name;
	let count = 0;
	let result;
	let radio = false;
	
	if (isSomeString(form)) {
		frm = document.querySelector(form);
	} else if (isArray(form)) {
		frm = form.length ? form[0]: null;
	} else if (isSomeObject(form)) {
		frm = form.context ? form[0]: form;
	}
	
	if (!isEmpty(frm) && isSomeString(key) && frm.elements && frm.elements.length) {
		result = [];
		
		for (let i = 0; i < frm.elements.length; i++) {
			el = frm.elements[i];
			
			name = (el.name || '').toLowerCase();
			type = (el.type || '').toLowerCase();
			tag = (el.tagName || '').toLowerCase();
			
			if (key.toLowerCase() == name || key == el.id || (key[0] == '#' && key.substr(1) == el.id)) {
				count++;
				
				if (type == 'checkbox' || type == 'radio') {
					if (type == 'radio') {
						radio = true;
					}
					
					if (el.checked) {
						result.push(el.value);
					}
				} else if (tag == 'select') {
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
			result = result.length ? result[0]: ''
		}
	}
	
	return result;
}

const setValue = (form, key, value) => {
	let frm;
	let el;
	let type;
	let tag;
	let name;
	
	if (isSomeString(form)) {
		frm = document.querySelector(form);
	} else if (isSomeObject(form)) {
		frm = form.context ? form[0]: form;
	} else if (isArray(form) && form.length) {
		frm = form[0];
	}
	
	if (!isEmpty(frm) && isSomeString(key) && frm.elements && frm.elements.length) {
		let _value = (value || '').toString().toLowerCase();
		
		for (let i = 0; i < frm.elements.length; i++) {
			el = frm.elements[i];
			
			name = (el.name || '').toLowerCase();
			type = (el.type || '').toLowerCase();
			tag = (el.tagName || '').toLowerCase();
			
			if (key.toLowerCase() == name || key == el.id || (key[0] == '#' && key.substr(1) == el.id)) {
				if (type == 'checkbox') {
					if (isArray(value)) {
						el.checked = contains(value, el.value);
					} else {
						el.checked = isBool(value) ? value : el.value.toLowerCase() == _value;
					}
				} else if (type == 'radio') {
					el.checked = isBool(value) ? value : el.value.toLowerCase() == _value;
				} else if (tag == 'select') {
					for (let j = 0; j < el.options.length; j++) {
						let opt = el.options[j];
						
						if (isArray(value)) {
							opt.selected = contains(value, opt.value) || value.indexOf(j) >= 0;
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
}

class Form {
	constructor(selector) {
		this._form = document.querySelector(selector);
	}
	get instance() {
		return this._form;
	}
	set instance(value) {
		this._form = value;
	}
	each(callback, excludes) {
		return formEach(this.instance, callback, excludes);
	}
	eachElement(callback, excludes) {
		return formEachElement(this.instance, callback, excludes);
	}
	enable(value = true) {
		enableForm(this.instance, value);
	}
	disable(value = true) {
		disableForm(this.instance, value);
	}
	readOnly(value = true) {
		readOnlyForm(this.instance, value);
	}
	unreadOnly(value = true) {
		unreadOnlyForm(this.instance, value);
	}
	clear() {
		clearForm(this.instance);
	}
	reset() {
		resetForm(this.instance);
	}
	fromJson() {
		fromJson(this.instance);
	}
	toJson() {
		return toJson(this.instance);
	}
	fromArray() {
		fromArray(this.instance);
	}
	toArray() {
		return toArray(this.instance);
	}
	getValue(key) {
		return getValue(this.instance, key);
	}
	setValue(key, value) {
		setValue(this.instance, key, value);
	}
}

const FormHelper = {
	each: formEach,
	eachElement: formEachElement,
	disable: disableForm,
	enable: enableForm,
	readOnly: readOnlyForm,
	unreadOnly: unreadOnlyForm,
	toArray: toArray,
	fromArray: fromArray,
	toJson: toJson,
	fromJson: fromJson,
	clear: clearForm,
	reset: resetForm,
	post: post,
	isEditable: isEditable,
	getValue: getValue,
	setValue: setValue
}

export default FormHelper;

export {
    formEachElement,
    formEach,
    isEditable,
    disableForm,
    enableForm,
    clearForm,
    resetForm,
    readOnlyForm,
    unreadOnlyForm,
    getValue,
    setValue,
    toJson,
    fromJson,
    toArray,
    fromArray,
    post,
    Form
}
