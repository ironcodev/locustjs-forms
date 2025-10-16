import formEach from "./formEach";
import formEachElement from "./formEachElement";
import { disable, enable, readOnly, reset, clear } from "./form-operations";
import fromJson from "./fromJson";
import toJson from "./toJson";
import fromArray from "./fromArray";
import toArray from "./toArray";
import { getValue, setValue } from "./get-set-value";

class Form {
  constructor(selector) {
    this.selector = selector;
  }
  each(callback, excludes) {
    return formEach(this.selector, callback, excludes);
  }
  eachElement(callback, excludes) {
    return formEachElement(this.selector, callback, excludes);
  }
  enable(...args) {
    enable(this.selector, ...args);
  }
  disable(...args) {
    disable(this.selector, ...args);
  }
  readOnly(...args) {
    readOnly(this.selector, ...args);
  }
  clear(...args) {
    clear(this.selector, ...args);
  }
  reset() {
    reset(this.selector);
  }
  fromJson(...args) {
    fromJson(this.selector, ...args);
  }
  toJson() {
    return toJson(this.selector);
  }
  fromArray(...args) {
    fromArray(this.selector, ...args);
  }
  toArray() {
    return toArray(this.selector);
  }
  getValue(key) {
    return getValue(this.selector, key);
  }
  setValue(key, value) {
    setValue(this.selector, key, value);
  }

  static each(...args) {
    return formEach(...args);
  }
  static eachElement(...args) {
    return formEachElement(...args);
  }
  static enable(...args) {
    enable(...args);
  }
  static disable(...args) {
    disable(...args);
  }
  static readOnly(...args) {
    readOnly(...args);
  }
  static clear(...args) {
    clear(...args);
  }
  static reset(...args) {
    reset(...args);
  }
  static fromJson(...args) {
    fromJson(...args);
  }
  static toJson(...args) {
    return toJson(...args);
  }
  static fromArray(...args) {
    fromArray(...args);
  }
  static toArray(...args) {
    return toArray(...args);
  }
  static getValue(...args) {
    return getValue(...args);
  }
  static setValue(...args) {
    setValue(...args);
  }
}

export default Form;
