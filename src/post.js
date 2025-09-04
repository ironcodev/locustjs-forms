import { isSomeString, isObject, isSomeObject } from "@locustjs/base";

const post = function () {
  if (arguments.length) {
    const options = {
      action: "",
      enctype: "",
      target: "",
      args: {},
    };

    const frm = document.createElement("FORM");

    frm.method = "post";

    if (isObject(arguments[0])) {
      options.action = arguments[0].url || arguments[0].action;
      options.args = arguments[0].args || arguments[0].params;
      options.target = arguments[0].target;
      options.enctype = arguments[0].enctype;
    } else {
      options.action = arguments[0];
      options.args = arguments.length > 1 ? arguments[1] : {};
      options.target = arguments.length > 2 ? arguments[2] : "";
      options.enctype = arguments.length > 3 ? arguments[3] : "";
    }

    frm.action = options.action;

    if (isSomeString(options.target)) {
      frm.target = options.target;
    }

    if (isSomeString(options.enctype)) {
      frm.enctype = options.enctype;
    }

    if (isSomeObject(options.args)) {
      for (let key of Object.keys(options.args)) {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = options.args[key];

        frm.appendChild(input);
      }
    }

    let body = document.getElementsByTagName("body");

    if (body && body.length) {
      body = body[0];

      body.appendChild(frm);

      frm.submit();
    }
  }
};

export default post;
