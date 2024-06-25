"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("vue");
require("../../utils/config.js");
const use = require("../../utils/use.js");
const container = require("./src/container.js");
const CuContainer = use.withInstall(container.Container);
const CuAside = use.withInstall(container.Aside);
const CuHeader = use.withInstall(container.Header);
const CuMain = use.withInstall(container.Main);
const CuFooter = use.withInstall(container.Footer);
exports.CuAside = CuAside;
exports.CuContainer = CuContainer;
exports.CuFooter = CuFooter;
exports.CuHeader = CuHeader;
exports.CuMain = CuMain;