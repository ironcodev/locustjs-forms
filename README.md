# About
This library provides utility functions to interact with forms and form elements in a web page.

## 🔗 Test &amp; Demo
Check out the live demo [here](https://ironcodev.github.io/locustjs-forms/)

# Install
```
npm i @locustjs/forms
```

# Usage

CommonJs
```javascript
var someFn = require('@locustjs/forms').someFn;
```

ES6
```javascript
import { someFn } from '@locustjs/forms'
```

# Current Version
```
3.0.0
```

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

```
First Name = Johen
Last Name = Doe
Sex = Male
Age Group = 20 to 45
I Agree = -
```

To get the form data as a json object we can use the following code:

```javascript
import { toJson } from '@locustjs/forms';

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
## Utility functions
### Form Element Iteration
|  function | description |
|-----------|-------------|
| `formEachElement(selector, callback, excludes)` | iterates over one or more forms whose selector are specified in 'selector' argument and calls the 'callback' argument on each form element it finds. The callback function has a signature as `callback(form, element, elementIndex, formIndex)`. Using the `excludes` parameter, we can exclude some form elements, so that they are not iterated over. |
| `formEach(selector, callback, excludes)` | This function carries out the same job as `formEachElement`, except that it ignores `buttons` and `fieldsets`, whereas `formEachElement` iterates `buttons` and `fieldsets` as well. |

By default, `selector` is `form`, resulting in iterating over all elements of all forms in the page.

More examples:

```javascript
formEach(callback);  // iterating all elements of all forms
formEach('#my-form', callback) // iterates over elements in a form whose id is 'my-form'
formEach('#frm1, #frm2', callback) // iterates over elements in a form whose id is 'frm1' and 'frm2'
formEach('.my-form', callback) // iterates over elements in all forms whose class is '.my-form'
formEach('.container .my-form', callback) // iterates over elements in a form enclosed in .container and whose class is 'my-form'
```

### Form Element Manipulation
|  function | description |
|-----------|-------------|
|`disable(selector, excludes, mode = true)` | changes disable mode of a form and its elements based on `mode` value. |
|`enable(selector, excludes, mode = true)` | changes disable mode of a form and its elements based on `mode` value.|
|`reset(selector)` | resets a form and its elements.|
|`clear(selector, excludes, includeHiddenFields = false)` | clears a form and its elements. Its difference with `reset()` method is that it can selectively clear fields, i.e. ignoring a few fields denoted by `excludes` parameter. Moreover, it does not reset hidden input fields by default. In order to also clear hidden fields, the third parameter should be used with `true` argument. |
|`readOnly(selector, excludes, mode)` | changes readonly mode of a form and its elements, based on `mode` value.|
|`getValue(form, elementName)` | returns value of a form element based on its name. The `form` parameter could be a form node in DOM or a selector.|
|`setValue(form, elementName, value)` | sets a value on a form element based on its name.|

`disable`, `enable` and `readOnly` methods have a simpler overload as below:

```javascript
disable(selector, mode = true)
enable(selector, mode = true)
readOnly(selector, mode = true)
```

So, the following examples are all valid:

```javascript
disable();  // disables all forms
disable('#my-form') // disables the form whose id is 'my-form'
disable('.my-form') // disables all forms whose class is '.my-form'
disable('.my-form', '.ignore') // disables elements in all forms whose class is '.my-form' excluding elements with '.ignore' class
disable('.my-form', false); // set disable mode of all elements in the form to 'false'
```

### Form Serialization/Deserialization
|  function | description |
|-----------|-------------|
|`toJson(form, [excludes])` | serializes a form into json.|
|`fromJson(form, obj)` | fills a form based on a json object.|
|`toArray(form)` | serializes form element values into array.|
|`fromArray(form, arr)` | fills a form based on an array of values.|

### Other
|  function | description |
|-----------|-------------|
| `isEditable(element)` | checks whether given element is a data entry element (user can potentially enter its value) or not. Editable elements are `textboxes`, `radio buttons`, `checkboxes`, `textareas` and `selects`. |
|`post(url, data)` | creates an arbitrary form, fills it with data and posts the form to the specified target url in HTTP POST method. |

### Form class
There is a helper `Form` class with static utility methods that eases working with forms. So, there's no need to import functions separately. We can only import `Form` and use its methods.

```javascript
import { Form } from '@locustjs/forms';

var x = Form.toJson('#my-form');

console.log(x);

Form.clear('#my-form');

Form.fromJson('#my-form');
```

The `Form` class also provides instance methods making it more convenient when working with a form, removing the need to refer to the form over and over again.

- `each()`
- `eachElement()`
- `enable()`
- `disable()`
- `readOnly()`
- `clear()`
- `reset()`
- `fromJson()`
- `toJson()`
- `fromArray()`
- `toArray()`
- `getValue()`
- `setValue()`

Example:
```javascript
const f = new Form('#my-form');

f.each((frm, el) => console.log(el));
f.enable();
f.disable();
f.readOnly();
f.readOnly(false);
f.reset();

const x = f.toJson();

console.log(x);

f.clear();
f.fromJson(x);

const arr = f.toArray();

console.log(arr);

f.clear();

f.fromArray(arr);

console.log(f.getValue('firstname'));
console.log(f.getValue('age-group'));

f.setValue('firstname', 'John');
f.setValue('age-group', 4);
```
