import formEachElement from './formEachElement';
import isEditable from './isEditable';

const formEach = (selector, callback, excludes) => {
	if (excludes == null) {
		excludes = (frm, el) => !isEditable(el);
	}
	
    return formEachElement(selector, callback, excludes);
}

export default formEach;