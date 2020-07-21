# locustjs-forms
This library provides utility functions to interact with forms and form elements in a web page.

## Converting an HTML form into JSON
example
Form
```html
<form class="my-form">
  <div>
    <label>
      <span>First Name</span>
      <input type="text" name="firstname" />
    </label>
  </div>
  <div>
    <label>
      <span>Last Name</span>
      <input type="text" name="lastname" />
    </label>
  </div>
  <div>
    <label>
      <span>Sex</span>
      <input type="radio" name="sex" value="male" /> Male
      <input type="radio" name="sex" value="female" /> Female
    </label>
  </div>
  <div>
    <label>
      <span>Age group</span>
      <select name="age-group">
        <option value="0">Not specified</option>
        <option value="1">6 and Below 6</option>
        <option value="2">7 to 12</option>
        <option value="3">13 to 19</option>
        <option value="4">20 to 45</option>
        <option value="5">46 and Over 46</option>
      </select>
    </label>
  </div>
  <div>
    <label>
      <span>I Agree</span>
      <input type="checkbox" name="agreement" />
    </label>
  </div>
</form>
```

Suppose we fill in the form with the following data:

First Name = Johen
Last Name = Doe
Sex = Male
Age Group = 20 to 45
I Agree = -

To get the form data as a json object we can use the following code:

```javascript
import { toJson } from 'locustjs-forms';

const data = toJson('.my-form');

console.log(data);
/*
  {
    "firstname": "John",
    "lastname": "Doe",
    "sex": "male",
    "age-group": "4",
    "agreement": []
  }
*/
```
## List of utility functions
- formEachElement(selector, callback, [excludes]): This function iterates over one or more forms whose selector are specified in 'selector' argument and calls the 'callback' argument on each form element it finds in the form. The arguments passed to the callback are: form, element, elementIndex, formIndex. Using the third parameter 'excludes' one can exclude some form elements, so that they are not inlcuded in iteration.
-    formEach(selector, callback, [excludes]): This function does the same thing as formEachElement, except that it ignores buttons and fieldsets (formEachElement also iterates buttons and fieldsets).
-    isEditable(element): This function checks whether given element is an input entry element (user can potentially enter its value) or not. Editable elements are textboxes, radio buttons, checkboxes, textareas, selects.
-    disableForm(selector): This function disables a form and its elements.
-    enableForm(selector): This function enables a form and its elements.
-    clearForm(selector): This function clears a form and its elements.
-    resetForm(selector): This function resets a form and its elements.
-    readOnlyForm(selector): This function makes a form and its elements readonly.
-    unreadOnlyForm(selector): This function makes a form and its elements writable.
-   getValue(form, elementName): This function returns value a form element based on its name.
-    setValue(form, elementName, value): This function sets a value on a form element based on its name.
-    toJson(form, [excludes]): This function serializes a form into json.
-    fromJson(form, obj): This function fills a form based on a json object.
-    toArray(form): This functions serializes form element values into array.
-    fromArray(form, arr): This function fills a form based on an array of values.
-    post(url, data): This function creates an arbitrary form, fills it with data and posts the form to the specified target url in HTTP POST method.
*    Form: This is a helper class with various helper methods.

There is a FormHelper object with methods with the same name as above functions. So, there's no need to import functions separately. We can only import FormHelper and use its methods.

```javascript
import FormHelper from 'locustjs-forms';

var x = FormHelper.toJson('#my-form');

console.log(x);

FormHelper.clear('#my-form');

FormHelper.fromJson('#my-form');
```

### Form class
This class provides more convenience when working with a form, removing the need to refer to the form over and over again.

- each(callback)
- eachElement(callback)
- enable()
- disable()
- readOnly()
- unreadOnly()
- clear()
- reset()
- fromJson(obj)
- toJson()
- fromArray(arr)
- toArray()
- getValue(key)
- setValue(key, value)

Example:
```javascript
var f = new Form('#my-form');

f.each((frm, el) => console.log(el));
f.enable();
f.disable();
f.readOnly();
f.unreadOnly();
f.reset();

var x = f.toJson();

console.log(x);

f.clear();
f.fromJson(x);

var arr = f.toArray();

console.log(arr);

f.clear();

f.fromArray(arr);

console.log(f.getValue('firstname'));
console.log(f.getValue('age-group'));

f.setValue('firstname', 'John');
f.setValue('age-group', 4);
```
