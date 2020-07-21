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

```
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

