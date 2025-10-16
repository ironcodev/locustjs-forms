# About
This library provides utility functions to interact with forms and form elements in a web page.

## 🔗 Test &amp; Demo
Check out the live demo [here](https://ironcodev.github.io/locustjs-forms/)

## Install
```
npm i @locustjs/forms
```

## Usage

CommonJs
```javascript
var someFn = require('@locustjs/forms').someFn;
```

ES6
```javascript
import { someFn } from '@locustjs/forms'
```

## Current Version
```
3.0.1
```

# Main Usage: Serialize a form into JSON
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

Suppose the form contains the following data:

```
First Name: Johen
Last Name: Doe
Sex: Male
Age Group: 20 to 45
```

To get the form as a javascript object we can use the following code:

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
# Utility functions
## Form Element Iteration
|  function | description |
|-----------|-------------|
| `formEachElement(selector, callback, excludes)` | iterates over one or more forms whose selector are specified in `selector` argument and calls the `callback` argument on each form element it finds. The callback function has a signature as `callback({ form, element, index, formIndex })`. Using the `excludes` parameter, we can exclude some form elements, so that they are not iterated over. This is explained in `Element Exclusion` section. |
| `formEach(selector, callback, excludes)` | This function carries out the same job as `formEachElement`, except that it ignores `buttons` and `fieldsets` by default, whereas `formEachElement` iterates `buttons` and `fieldsets` as well. If we specify an `excludes` argument for `formEach` it behaves the same as `formEachElement` |

By default, `selector` is `form`, resulting in iterating over all elements of all &lt;form&gt; tags in the page.

More examples:

```javascript
formEach(callback);  // iterating all elements of all forms
formEach('#my-form', callback) // iterates over elements in a form whose id is 'my-form'
formEach('#frm1, #frm2', callback) // iterates over elements in a form whose id is 'frm1' and 'frm2'
formEach('.my-form', callback) // iterates over elements in all forms whose class is '.my-form'
formEach('.container .my-form', callback) // iterates over elements in a form enclosed in .container and whose class is 'my-form'
```

When `formEachElement` or `formEach` find more than one form selector, they return an array.
Each item in the array is an object that relates to the elements of each form read.

## Form Element Manipulation
|  function | description |
|-----------|-------------|
|`disable(selector, excludes, mode = true)` | changes disable mode of a form and its elements based on `mode` value. |
|`enable(selector, excludes, mode = true)` | changes disable mode of a form and its elements based on `mode` value.|
|`reset(selector)` | resets a form and its elements.|
|`clear(selector, excludes, includeHiddenFields = false)` | clears a form and its elements. Its difference with `reset()` method is that it can selectively clear fields, i.e. ignoring a few fields specified by `excludes` parameter. Moreover, it does not reset hidden input fields by default. In order to also clear hidden fields, the third parameter should be used with `true` argument. |
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

## Form Serialization/Deserialization
|  function | description |
|-----------|-------------|
|`toJson(selector, excludes, expandNames)` | serializes a form into json.|
|`fromJson(selector, obj, excludes, flattenProps)` | fills a form based on a json object.|
|`toArray(selector, excludes)` | serializes form element values into array.|
|`fromArray(selector, arr, excludes)` | fills a form based on an array of values.|

## Other
|  function | description |
|-----------|-------------|
| `isEditable(element)` | checks whether given element is a data entry element (user can potentially enter its value) or not. Editable elements are `textboxes`, `radio buttons`, `checkboxes`, `textareas` and `selects`. |
|`post(url, data)` | creates an arbitrary form, fills it with data and posts the form to the specified target url in HTTP POST method. |

## Form class
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

# Element Exclusion
Some form utility functions receive an `excludes` parameter that is used to exclude form elements during their operation.

The `excludes` could be a selector or a custom function.
In simplest form, we can apply a custom css class such as `.ignore` to some of our form elements and then specify this class
for the `excludes` parameter in functions such as `toJson`, `readOnly`, `disable`, etc.

Example:
```javascript
import { toJson, readOnly } from "@locustjs/forms";

const data = toJson('.my-form', '.ignore'); // ignore elements with .ignore css class

readOnly('.my-form', '.ignore');  // readonly all elements except those with .ignore css class
```

When specifying a custom function for the `excludes` parameter, the function should follow the following signature:

```javascript
fnExclude({ form, element, index, formIndex }): bool
```

The function should return `true` or `false` in order to specify the element should be ignored or not.

# Expanding names
The `toJson` function has a third parameter named `exapndNames`. If we use dot character in the name of our form elements and specify `true` for `expandNames` in `toJson` function, it will turn such form elements into object, resulting in a nested object being returned.

Example:

```html
<form class="my-form">
  <fieldset>
    <legend>Account Info</legend>
    <label>
      <span>User Name</span>
      <input type="text" name="user.name" />
    </label>
    <label>
      <span>Password</span>
      <input type="password" name="user.pass" />
    </label>
  </fieldset>

  <fieldset>
    <legend>Personal Info</legend>
    <label>
      <span>First Name</span>
      <input type="text" name="person.firstName" />
    </label>
    <label>
      <span>Last Name</span>
      <input type="text" name="person.lastName" />
    </label>
  </fieldset>

  
</form>
```


```javascript
import { toJson } from '@locustjs/forms';

const data = toJson('.my-form', '', true);

console.log(data);
/*
  {
    user: {
      "name": "user1",
      "pass": "1234",
    },
    person: {
      "firstName": "John",
      "lastName": "Doe",
    }
  }
*/
```
