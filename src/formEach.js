import formEachElement from './formEachElement';
import isEditable from './isEditable';

const formEach = (selector, callback, excludes) => {
	if (excludes == null) {
		excludes = ({ element }) => !isEditable(element);
	}
	
    return formEachElement(selector, callback, excludes);
}

export default formEach;