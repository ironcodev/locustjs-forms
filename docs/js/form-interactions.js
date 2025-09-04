window.onload = function () {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
};
function getForm() {
  const { Form } = window["@locustjs/forms"];

  return new Form("#frm1");
}
function test_toJson() {
  const json = getForm().toJson();
  const result = document.querySelector("#result1");
  const pre = document.querySelector("pre");

  pre.classList.remove("prettyprinted");

  document.getElementById("from").value = result.innerHTML = JSON.stringify(
    json,
    null,
    4
  );

  PR.prettyPrint();
}

function test_fromJson() {
  try {
    let json = document.getElementById("from").value;
    json = JSON.parse(json);
    getForm().fromJson(json);
  } catch (error) {
    alert(error);
  }
}
function test_toArray() {
  const json = getForm().toArray();
  const result = document.querySelector("#result1");
  const pre = document.querySelector("pre");

  pre.classList.remove("prettyprinted");

  document.getElementById("from").value = result.innerHTML = JSON.stringify(
    json,
    null,
    4
  );

  PR.prettyPrint();
}

function test_fromArray() {
  try {
    let json = document.getElementById("from").value;
    json = JSON.parse(json);
    getForm().fromArray(json);
  } catch (error) {
    alert(error);
  }
}
function test_getValue() {
  const name = prompt("Enter field name");

  if (name) {
    alert(getForm().getValue(name));
  }
}
function test_setValue() {
  const name = prompt("Enter field name");

  if (name) {
    const value = prompt("Enter value");

    getForm().setValue(name, value);
  }
}
