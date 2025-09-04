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
  enable(...args) {
    enable(this.instance, ...args);
  }
  disable(...args) {
    disable(this.instance, ...args);
  }
  readOnly(...args) {
    readOnly(this.instance, ...args);
  }
  clear(...args) {
    clear(this.instance, ...args);
  }
  reset() {
    reset(this.instance);
  }
  fromJson(...args) {
    fromJson(this.instance, ...args);
  }
  toJson() {
    return toJson(this.instance);
  }
  fromArray(...args) {
    fromArray(this.instance, ...args);
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
