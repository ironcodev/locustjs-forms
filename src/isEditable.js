const NON_DATA_ENTRY_INPUT_TYPES = ["button", "submit", "reset", "image"];
const NON_DATA_ENTRY_TAGS = ["button", "fieldset", "legend"];

const isEditable = (el) => {
  let result = false;

  if (el) {
    let _type = (el.type || "").toLowerCase();
    let _tag = (el.tagName || "").toLowerCase();

    result = !(
      NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 ||
      NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0
    );
  }

  return result;
};

export default isEditable;
