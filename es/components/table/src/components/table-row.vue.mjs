import { defineComponent, inject, ref, watch, computed, resolveComponent, openBlock, createElementBlock, Fragment, withDirectives, createElementVNode, normalizeClass, unref, createVNode, createCommentVNode, renderList, normalizeStyle, renderSlot, createTextVNode, toDisplayString, vShow, createBlock, createSlots, withCtx } from "vue";
import { CuCheckbox } from "../../../checkbox/index.mjs";
import { isFunction } from "../../../../utils/typescript.mjs";
import "../../../../utils/config.mjs";
import { deepEqual } from "../../../../utils/tools.mjs";
import { tableRowProps } from "./row.props.mjs";
import { TABLE_PROVIDE } from "../type.mjs";
const _hoisted_1 = {
  key: 0,
  class: "cu-table__expand"
};
const _hoisted_2 = ["colspan"];
const MIN_SIZE = 120;
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "CuTableRow"
  },
  __name: "table-row",
  props: tableRowProps,
  setup(__props) {
    const props = __props;
    const { props: injectProps, checkList, treeProps, changeSelection, addOption } = inject(TABLE_PROVIDE);
    const showmore = ref(false);
    const moreList = ref([]);
    const loadLoading = ref(false);
    const isLazy = ref(false);
    watch(
      () => props.show,
      (val) => {
        if (!val) {
          showmore.value = false;
        }
      }
    );
    const isCheck = computed(() => {
      return checkList.value.findIndex((v) => deepEqual(v, props.row)) >= 0;
    });
    const rowChildList = computed(() => {
      var _a;
      return [...((_a = props.row) == null ? void 0 : _a[treeProps.children]) ?? [], ...moreList.value];
    });
    const columns = computed(() => {
      var _a;
      let column = ((_a = injectProps.options) == null ? void 0 : _a.column) ?? [];
      column = column.sort((a, b) => {
        if (a.fixed === "left" && (!b.fixed || b.fixed !== "left")) {
          return -1;
        } else if (b.fixed === "left" && (!a.fixed || a.fixed !== "left")) {
          return 1;
        } else if (a.fixed === "right" && b.fixed !== "right") {
          return 1;
        } else if (b.fixed === "right" && a.fixed !== "right") {
          return -1;
        } else {
          return 0;
        }
      });
      return column;
    });
    function findLastObjectWithProperty() {
      var _a, _b;
      for (let i = ((_a = columns.value) == null ? void 0 : _a.length) - 1; i >= 0; i--) {
        let item = (_b = columns.value) == null ? void 0 : _b[i];
        if ((item == null ? void 0 : item.fixed) === "left") {
          return i;
        }
      }
      return -1;
    }
    const getStickyIndex = computed(() => {
      var _a;
      return {
        left: findLastObjectWithProperty(),
        right: (_a = columns.value) == null ? void 0 : _a.findIndex((v) => v.fixed === "right")
      };
    });
    function styles(css, index) {
      let obj = {
        "--cu-table-td-paddingleft": props.calcPaddingLeft + 4 + "px"
      };
      obj.textAlign = css.align;
      if (css.fixed === "left") {
        obj.left = getStickyLeft(index) + "px";
      } else if (css.fixed === "right") {
        obj.right = getStickyRight(index) + "px";
      }
      return obj;
    }
    function getStickyLeft(index) {
      var _a, _b;
      let left = 0;
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          let item = (_a = columns.value) == null ? void 0 : _a[i];
          left += (item == null ? void 0 : item.fixed) === "left" ? (item == null ? void 0 : item.width) || MIN_SIZE : 0;
        }
      }
      left += ((_b = injectProps.options) == null ? void 0 : _b.selection) ? 40 : 0;
      return left;
    }
    function getStickyRight(index) {
      var _a, _b, _c;
      let right = 0;
      if (index < ((_a = columns.value) == null ? void 0 : _a.length) - 1) {
        for (let i = ((_b = columns.value) == null ? void 0 : _b.length) - 1; i > index; i--) {
          let item = (_c = columns.value) == null ? void 0 : _c[i];
          right += (item == null ? void 0 : item.fixed) === "right" ? (item == null ? void 0 : item.width) || MIN_SIZE : 0;
        }
      }
      return right;
    }
    function getColClassName(td, tdIndex) {
      if (isFunction(td.className)) {
        return td.className(props.row, props.index, props.row[td.prop], tdIndex);
      } else {
        return td.className;
      }
    }
    function loadMore() {
      var _a;
      if (injectProps.lazyLoad && !isLazy.value) {
        loadLoading.value = true;
        isLazy.value = true;
        (_a = injectProps.load) == null ? void 0 : _a.call(injectProps, props.row, _then);
      } else {
        showmore.value = !showmore.value;
      }
      function _then(arr) {
        addOption(arr);
        moreList.value = [...moreList.value, ...arr];
        showmore.value = true;
        loadLoading.value = false;
      }
    }
    return (_ctx, _cache) => {
      const _component_cu_table_row = resolveComponent("cu-table-row");
      return openBlock(), createElementBlock(Fragment, null, [
        withDirectives(createElementVNode("tr", {
          class: normalizeClass(["cu-table__row", _ctx.row.rowClassName])
        }, [
          unref(injectProps).options.selection ? (openBlock(), createElementBlock("td", {
            key: 0,
            class: normalizeClass(["cu-table__td checkbox fixed-left", { "fixed-shadow-left": getStickyIndex.value.left == -1 }]),
            width: "40"
          }, [
            createVNode(unref(CuCheckbox), {
              "model-value": isCheck.value,
              onChange: _cache[0] || (_cache[0] = ($event) => unref(changeSelection)($event, _ctx.row))
            }, null, 8, ["model-value"])
          ], 2)) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(columns.value, (td, i) => {
            return openBlock(), createElementBlock("td", {
              colspan: "1",
              rowspan: "1",
              class: normalizeClass(["cu-table__td", [
                td.fixed ? "fixed-" + td.fixed : void 0,
                { "fixed-shadow-left": getStickyIndex.value.left == i },
                { "fixed-shadow-right": getStickyIndex.value.right == i },
                getColClassName(td, i)
              ]]),
              key: i,
              style: normalizeStyle(styles(td, i))
            }, [
              (_ctx.row[unref(treeProps).children] || _ctx.row[unref(treeProps).hasChildren] || unref(injectProps).expand) && i === 0 ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass(["cu-table__td-placeholder", { unfold: showmore.value }]),
                style: normalizeStyle({ left: _ctx.calcPaddingLeft - 16 + "px" }),
                onClick: loadMore
              }, [
                createElementVNode("i", {
                  class: normalizeClass(loadLoading.value ? "cu-icon-loading" : "cu-icon-right")
                }, null, 2)
              ], 6)) : createCommentVNode("", true),
              createElementVNode("span", null, [
                renderSlot(_ctx.$slots, td.prop, { row: _ctx.row }, () => [
                  createTextVNode(toDisplayString(_ctx.row[td.prop] ?? unref(injectProps).options.empty), 1)
                ])
              ])
            ], 6);
          }), 128))
        ], 2), [
          [vShow, _ctx.show]
        ]),
        unref(injectProps).expand && _ctx.$slots.expand ? withDirectives((openBlock(), createElementBlock("div", _hoisted_1, [
          createElementVNode("td", {
            colspan: columns.value.length,
            class: "cu-table__expand-td",
            style: normalizeStyle({ "--placeholder-left": _ctx.calcPaddingLeft - 16 + "px" })
          }, [
            renderSlot(_ctx.$slots, "expand", { row: _ctx.row })
          ], 12, _hoisted_2)
        ], 512)), [
          [vShow, showmore.value]
        ]) : createCommentVNode("", true),
        _ctx.row[unref(treeProps).children] || _ctx.row[unref(treeProps).hasChildren] ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(rowChildList.value, (item, idx) => {
          return openBlock(), createBlock(_component_cu_table_row, {
            key: idx,
            row: item,
            calcPaddingLeft: _ctx.calcPaddingLeft + 10,
            show: showmore.value
          }, createSlots({ _: 2 }, [
            renderList(columns.value, (td) => {
              return {
                name: td.prop,
                fn: withCtx(({ row }) => [
                  renderSlot(_ctx.$slots, td.prop, { row })
                ])
              };
            }),
            unref(injectProps).expand && _ctx.$slots.expand ? {
              name: "expand",
              fn: withCtx(({ row }) => [
                renderSlot(_ctx.$slots, "expand", { row })
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["row", "calcPaddingLeft", "show"]);
        }), 128)) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};