const has = (el, name) => {
  let result = false;

  const attrs = el.attributes;

  if (el && el.attributes && el.attributes.length) {
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
