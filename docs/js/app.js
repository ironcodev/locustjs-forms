window.onload = function () {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
  if (typeof pageLoad == "function") {
    pageLoad();
  }
};

function test_toJson(selector = "", resultSelector = "#result") {
  const { toJson } = window["@locustjs/forms"];
  const json = toJson(selector, ".chk-disable,.chk-ignore,.ignore");
  const result = document.querySelector(resultSelector);
  const pre = document.querySelector("pre");

  pre.classList.remove("prettyprinted");

  result.innerHTML = JSON.stringify(json, null, 4);

  PR.prettyPrint();
}

