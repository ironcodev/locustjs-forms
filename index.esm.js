import { isSomeString, isObject, isSomeObject, isEmpty, isFunction, isArray, isBoolean } from 'locustjs-base';
import { contains } from 'locustjs-extensions-array';

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
				
				excludes = el => {
					if (contains(arg, el.tagName)) {
						return true;
					}
					
					for (let className of classNames) {
						if ((el.className + ' ').indexOf(className.substr(1) + ' ')) {
							return true;
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
    return formEachElement(selector, (frm, el, i, j) => {
        if (isEditable(el)) {
            return callback(frm, el, i, j);
        }
    }, excludes);
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

const toJson = (selector, excludes) => {
    let result = [];

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
			
            if (el.checked) {
                result[j][_key].push(el.value);
            }
        } else if (_tag == 'select') {
			if (el.multiple) {
				result[j][_key] = [];
				
				for (let ii = 0; ii < el.selectedOptions.length; ii++) {
					result[j][_key].push(el.selectedOptions[ii].value);
				}
			} else {
				result[j][_key] = el.options[el.selectedIndex].value;
			}
        } else {
            result[j][_key] = el.value;
        }
    }, excludes);

    if (result.length == 0) {
        return {};
    } else if (result.length == 1) {
        return result[0];
    }

    return result;
};
const fromJson = (selector, obj, excludes) => {
    if (isSomeObject(obj) || isArray(obj)) {
        formEach(selector, (frm, el, i, j) => {
            let _type = (el.type || '').toLowerCase();
            let _tag = (el.tagName || '').toLowerCase();
            let _name = el.name;
            let _id = el.id;
            let _key = _name || _id;

            if (isEmpty(_key)) {
                _key = i;
            }

            let data = isArray(obj) ? obj[j]: obj;
            let value = data[_key];

            if (value != null) {
                if ((_type == 'checkbox' || _type == 'radio')) {
                    if (isBoolean(value)) {
                        el.checked = value;
                    } else if (isArray(value)) {
                        el.checked = value.indexOf(el.value) >= 0;
                    } else {
                        el.checked = el.value == value;
                    }
                } else if (_tag == 'select') {
					if (el.multiple) {
						if (isArray(value)) {
							for (let ii = 0; ii < el.options.length; ii++) {
								el.options[ii].selected = contains(value, el.options[ii].value);
							}
						} else {
							el.selectedIndex = value;
						}
					} else {
						el.selectedIndex = value;
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
	} else if (isSomeObject(form)) {
		frm = form.context ? form[0]: form;
	} else if (isArray(form) && form.length) {
		frm = form[0];
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
						result.push(subResult[0]);
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
						el.checked = el.value.toLowerCase() == _value;
					}
				} else if (type == 'radio') {
					el.checked = el.value.toLowerCase() == _value;
				} else if (tag == 'select') {
					for (let j = 0; j < el.options.length; j++) {
						let opt = el.options[j];
						
						if (isArray(value)) {
							opt.selected = contains(value, opt.value) || value.indexOf(j) >= 0;
						} else {
							opt.selected = opt.value.toLowerCase() == _value;
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
		return formEach(this._form, callback, excludes);
	}
	eachElement(callback, excludes) {
		return formEachElement(this._form, callback, excludes);
	}
	enable(value = true) {
		enableForm(this._form, value);
	}
	disable(value = true) {
		disableForm(this._form, value);
	}
	readOnly(value = true) {
		readOnlyForm(this._form, value);
	}
	unreadOnly(value = true) {
		unreadOnlyForm(this._form, value);
	}
	clear() {
		clearForm(this._form);
	}
	reset() {
		resetForm(this._form);
	}
	fromJson() {
		fromJson(this._form);
	}
	toJson() {
		return toJson(this._form);
	}
	getValue(key) {
		return getValue(this._form, key);
	}
	setValue(key, value) {
		setValue(this._form, key, value);
	}
}

const FormHelper = {
	each: formEach,
	eachElement: formEachElement,
	disable: disableForm,
	enable: enableForm,
	readOnly: readOnlyForm,
	unreadOnly: unreadOnlyForm,
	fromJson: fromJson,
	toJson: toJson,
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
    post,
    Form
}
