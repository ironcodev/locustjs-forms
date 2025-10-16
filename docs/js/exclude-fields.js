function pageLoad() {
  for (let chk of document.querySelectorAll(".chk-disable")) {
    chk.addEventListener("change", toggleDisable);
  }
  for (let chk of document.querySelectorAll(".chk-ignore")) {
    chk.addEventListener("change", toggleIgnore);
  }
}
function toggleDisable(e) {
  let div =
    e.target.parentElement.parentElement.parentElement.querySelector(
      "div.col-8"
    );
  let els = div.querySelectorAll("input,textarea,select");

  for (let el of els) {
    if (el.disabled == null) {
      el.disabled = true;
    } else {
      el.disabled = !el.disabled;
    }
  }
}
function toggleIgnore(e) {
  let div =
    e.target.parentElement.parentElement.parentElement.querySelector(
      "div.col-8"
    );
  let els = div.querySelectorAll("input,textarea,select");

  for (let el of els) {
    el.classList.toggle("ignore");
  }
}
function make_readOnly() {
  const { readOnly } = window["@locustjs/forms"];

  readOnly("", ".ignore,.chk-disable,.chk-ignore", true);
}
function make_unReadOnly() {
  const { readOnly } = window["@locustjs/forms"];

  readOnly("", ".ignore,.chk-disable,.chk-ignore", false);
}
function make_disabled() {
  const { disable } = window["@locustjs/forms"];

  disable("", ".ignore,.chk-disable,.chk-ignore", true);
}
function make_enabled() {
  const { enable } = window["@locustjs/forms"];

  enable("", ".ignore,.chk-disable,.chk-ignore", true);
}
