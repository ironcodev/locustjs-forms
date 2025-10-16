const NON_DATA_ENTRY_INPUT_TYPES = ["button", "submit", "reset", "image"];
const NON_DATA_ENTRY_TAGS = ["button", "fieldset", "legend"];

const isEditable = (element) => {
  let result = false;

  if (element) {
    let _type = (element.type || "").toLowerCase();
    let _tag = (element.tagName || "").toLowerCase();

    result = !(
      NON_DATA_ENTRY_INPUT_TYPES.indexOf(_type) >= 0 ||
      NON_DATA_ENTRY_TAGS.indexOf(_tag) >= 0
    );
  }

  return result;
};

export default isEditable;
