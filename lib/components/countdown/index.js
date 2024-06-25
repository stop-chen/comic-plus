"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("vue");
require("../../utils/config.js");
const use = require("../../utils/use.js");
const main = require("./src/main.js");
const CuCountdown = use.withInstall(main.default);
exports.CuCountdown = CuCountdown;