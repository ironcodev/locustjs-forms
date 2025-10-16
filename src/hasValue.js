const has = (element, name) => {
  let result = false;

  const attrs = element.attributes;

  if (element && element.attributes && element.attributes.length) {
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].name.toLowerCase() == name) {
        result = true;
        break;
      }
    }
  }

  return result;
};
const hasValue = (el) => has(el, "value");

export { has, hasValue };
