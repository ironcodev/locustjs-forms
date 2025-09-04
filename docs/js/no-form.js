window.onload = function () {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
};
function test_toJson(selector, resultSelector) {
  const { toJson } = window["@locustjs/forms"];
  const json = toJson(selector, '.ignore');
  const result = document.querySelector(resultSelector);
  const pre = document.querySelector("pre");

  pre.classList.remove("prettyprinted");

  result.innerHTML = JSON.stringify(json, null, 4);

  PR.prettyPrint();
}

