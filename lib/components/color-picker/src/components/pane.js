"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const core = require("@vueuse/core");
const type = require("../type.js");
const pane = vue.defineComponent({
  name: "CuColorPane",
  setup() {
    const { color } = vue.inject(type.COLORPICKER_PROVIDE);
    const instance = vue.getCurrentInstance();
    const x = vue.ref(0);
    const y = vue.ref(0);
    var clearMove, clearUp;
    const background = vue.computed(() => {
      return `hsl(${color.get("hue")}deg 100% 50%)`;
    });
    const colorValue = vue.computed(() => {
      return color.get("value");
    });
    vue.watch(
      () => colorValue.value,
      (val) => {
        update(val);
      }
    );
    vue.onMounted(() => {
      update(colorValue.value);
    });
    function update(value) {
      const saturation = color.get("saturation");
      const ele = instance == null ? void 0 : instance.vnode.el;
      let { clientWidth, clientHeight } = ele;
      clientWidth = Math.max(clientWidth, 288);
      clientHeight = Math.max(clientHeight, 160);
      x.value = saturation * clientWidth / 100;
      y.value = (100 - value) * clientHeight / 100;
    }
    const spotStyle = vue.computed(() => {
      return {
        left: x.value + "px",
        top: y.value + "px"
      };
    });
    function mousedown(e) {
      setLeftAndTop(e);
      updateColor();
      clearMove = core.useEventListener(document, "mousemove", move);
      clearUp = core.useEventListener(document, "mouseup", up);
    }
    function move(e) {
      setLeftAndTop(e);
      updateColor();
    }
    function setLeftAndTop(e) {
      const ele = instance == null ? void 0 : instance.vnode.el;
      const rect = ele == null ? void 0 : ele.getBoundingClientRect();
      let left = e.clientX - rect.left;
      let top = e.clientY - rect.top;
      left = Math.max(0, left);
      left = Math.min(left, rect.width);
      top = Math.max(0, top);
      top = Math.min(top, rect.height);
      x.value = left;
      y.value = top;
    }
    function up() {
      clearMove == null ? void 0 : clearMove();
      clearUp == null ? void 0 : clearUp();
    }
    function updateColor() {
      if (color) {
        const ele = instance == null ? void 0 : instance.vnode.el;
        const { clientWidth, clientHeight } = ele;
        color.set({
          saturation: x.value / clientWidth * 100,
          value: 100 - y.value / clientHeight * 100
        });
      }
    }
    return () => {
      return vue.h(
        "div",
        { class: "cu-color-picker__pane", style: { background: background.value }, onmousedown: mousedown },
        [
          vue.h("div", { class: "mixin_white" }),
          vue.h("div", { class: "mixin_black" }),
          vue.h("div", { class: "spot", style: spotStyle.value })
        ]
      );
    };
  }
});
exports.default = pane;