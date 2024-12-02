<template>
  <li class="cu-sub-menu" :class="{ 'is-active': active }">
    <div class="cu-sub-menu__head" ref="submenuRef" :tooltip-disabled="tooltipDisabled"
      v-menu-tooltip:right-center="props.label">
      <component v-if="isVueComponent(icon)" :is="icon" class="cu-menu__icon" />
      <span v-show="!injectProps.collapse || submenu">
        <slot name="label"> {{ label }} </slot>
      </span>
      <component v-show="!injectProps.collapse || submenu" class="suffix-icon"
        :is="injectProps.mode === 'horizontal' ? Down : Right" :class="{ unfold }" />
    </div>
    <template v-if="float">
      <menu-popper :trigger="submenuRef" :show="unfold" :fixed="!teleportDisabled" @mouse-in="clearTimes"
        @mouse-out="createTimes">
        <ul class="cu-sub-menu__content" :style="style">
          <slot></slot>
        </ul>
      </menu-popper>
    </template>
    <template v-else>
      <transition-collapse>
        <ul class="cu-sub-menu__content" v-show="unfold" :style="{ '--cu-menu-padding': deptOffset * 20 + 'px' }">
          <slot></slot>
        </ul>
      </transition-collapse>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, provide, onBeforeUnmount, getCurrentInstance, onMounted, watch } from 'vue';
import { useTooltip } from '../../tooltip';
import { useMenu } from '../utils/menu';
import { useEventListener } from '@vueuse/core';
import { CuTransitionCollapse as TransitionCollapse } from '../../transition-collapse';
import MenuPopper from './menu-popper.vue';
import { submenuProps } from './submenu.props';
import { MENU_PROVIDE, SubmenuProvide, MenuItem } from './type';
import { isVueComponent } from '../../../utils';
import { Down, Right } from '../../../icons';

defineOptions({
  name: 'CuSubMenu'
});

const vMenuTooltip = useTooltip();

const props = defineProps(submenuProps);
const instance = getCurrentInstance()!;

const submenuKey = props.index ?? instance.uid.toString();

const submenuRef = ref(null);
var timer: number | null = null,
  clearEnter: (() => void) | null = null,
  clearLeave: (() => void) | null = null,
  clearClick: (() => void) | null = null;

const unfold = ref(props.open);
const menus = reactive({}) as { [key: string]: MenuItem };

const { props: injectProps, style } = inject(MENU_PROVIDE);

const { parentMenu } = useMenu(instance);

const parentProvideKey = 'submenu:provide' + parentMenu.value?.exposed?.submenuKey;
const submenu = inject<SubmenuProvide>(parentProvideKey, undefined);

const deptOffset = computed(() => {
  return submenu ? submenu.offset : 2;
});

const teleportDisabled = computed(() => {
  return !!submenu;
});

const active = computed(() => {
  return Object.values(menus).some((v) => v.active);
});

const tooltipDisabled = computed(() => {
  return !(!injectProps.collapse && props.showEllipsis);
});

const float = computed(() => {
  return injectProps.mode === 'horizontal' || injectProps.collapse;
});

function initListener() {
  if (float.value) {
    clearEnter = useEventListener(submenuRef, 'mouseenter', onmouseenter);
    clearLeave = useEventListener(submenuRef, 'mouseleave', createTimes);
  } else {
    clearClick = useEventListener(submenuRef, 'click', headHandleClick);
  }
}
initListener();

function headHandleClick() {
  unfold.value = !unfold.value;
}

function onmouseenter() {
  clearTimes();
  unfold.value = true;
}

function clearTimes() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
function createTimes() {
  if (!timer) {
    timer = setTimeout(() => {
      closeMenu();
    }, 150);
  }
}

function closeMenu(deep?: boolean) {
  unfold.value = false;
  clearTimes();
  if (deep) {
    submenu?.closeMenu(deep);
  }
}

function setMenu(item: MenuItem) {
  menus[item.idx] = item;
}

function removeMenu(idx: string) {
  delete menus[idx];
}

watch(float, () => {
  clearEnter?.();
  clearLeave?.();
  clearClick?.();
  unfold.value = false;
  initListener();
});

provide('submenu:provide' + submenuKey, {
  closeMenu,
  setMenu,
  removeMenu,
  offset: deptOffset.value + 1
});

defineExpose({ submenuKey });

onMounted(() => {
  submenu?.setMenu({
    idx: submenuKey,
    active
  });
});

onBeforeUnmount(() => {
  submenu?.removeMenu(submenuKey);
});
</script>
