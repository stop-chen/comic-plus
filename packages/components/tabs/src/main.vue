<template>
  <div
    class="cu-tabs"
    :class="[type ? 'is-' + type : undefined, { 'is-only-tab': onlyTab }, { 'has-scroll': hasScroll }]"
    :style="{ '--cu-tabs-color': color }">
    <div class="cu-tabs__header">
      <div class="cu-tabs__head">
        <span class="cu-tabs__button left-button" v-if="hasScroll" @click="scrollTo(-1)">
          <Left />
        </span>
        <span class="cu-tabs__button right-button" v-if="hasScroll" @click="scrollTo(1)">
          <Right />
        </span>
        <div class="cu-tabs__scroll" ref="tabScrollRef">
          <div class="cu-tabs__list" ref="tabListRef">
            <span
              v-for="nav in tabList"
              class="cu-tabs__item"
              :tab-nav="nav.name"
              :key="nav.name"
              :class="{ 'is-active': modelValue === nav.name }"
              @click="navClick(nav.name)">
              <span class="cu-tabs__label">
                <template v-if="nav.labelSlots">
                  <component v-for="item in nav.labelSlots" :is="item" />
                </template>
                <template v-else>
                  <component v-if="isVueComponent(nav.icon)" :is="nav.icon" class="cu-tabs__icon" />
                  {{ nav.label }}
                </template>
              </span>
              <span class="cu-tabs__closable" v-if="closable">
                <CloseSmall class="close-icon" @click.stop="emit('tab-remove', nav.name)" />
              </span>
              <svg class="cu-tabs__arc" v-if="type === 'arc'" width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1 6M1 6Q2.01789 6 2.94593 5.60747Q3.84305 5.22803 4.53562 4.53554Q5.22803 3.84305 5.60747 2.94593Q6 2.01789 6 1Q6 0.901509 6.01921 0.80491Q6.03843 0.708311 6.07612 0.617317Q6.11381 0.526323 6.16853 0.44443Q6.22325 0.362537 6.29289 0.292893Q6.36254 0.223249 6.44443 0.16853Q6.52632 0.113812 6.61732 0.0761205Q6.70831 0.0384295 6.80491 0.0192147Q6.90151 0 7 0Q7.09849 0 7.19509 0.0192147Q7.29169 0.0384295 7.38268 0.0761205Q7.47368 0.113812 7.55557 0.16853Q7.63746 0.223249 7.70711 0.292893Q7.77675 0.362537 7.83147 0.44443Q7.88619 0.526323 7.92388 0.617317Q7.96157 0.708311 7.98078 0.80491Q8 0.901509 8 1Q8 2.42346 7.44949 3.72503Q6.9181 4.98137 5.94975 5.94983Q4.98137 6.91811 3.72503 7.44949Q2.42346 8 1 8Q0.901509 8 0.80491 7.98078Q0.708311 7.96157 0.617316 7.92388Q0.526322 7.88619 0.44443 7.83147Q0.362537 7.77675 0.292893 7.70711Q0.223249 7.63746 0.16853 7.55557Q0.113811 7.47368 0.0761205 7.38268Q0.0384294 7.29169 0.0192147 7.19509Q0 7.09849 0 7Q0 6.90151 0.0192147 6.80491Q0.0384294 6.70831 0.0761205 6.61732Q0.113811 6.52632 0.16853 6.44443Q0.223249 6.36254 0.292893 6.29289Q0.362537 6.22325 0.44443 6.16853Q0.526322 6.11381 0.617316 6.07612Q0.708311 6.03843 0.80491 6.01921Q0.901509 6 1 6Z"></path>
              </svg>
            </span>
            <span v-if="type === 'card'" class="cu-tabs__cardline" :style="cardLineStyle"></span>
          </div>
        </div>
      </div>
      <div class="cu-tabs__header-extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="cu-tabs__container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, reactive, CSSProperties, watch, nextTick, onMounted } from 'vue';
import '../style/tab.css';
import { tabsProps, tabsEmits } from './main.props';
import { TABS_PROVIDE, PaneInstance } from './type';
import { isVueComponent } from '../../../utils';
import { CloseSmall, Left, Right } from '../../../icons';

defineOptions({
  name: 'CuTabs'
});

const props = defineProps(tabsProps);
const emit = defineEmits(tabsEmits);

const tabListRef = ref<HTMLElement>(null);
const tabScrollRef = ref<HTMLElement>(null);
const cardLineStyle = reactive({}) as CSSProperties;
const tabList = ref<PaneInstance[]>([]);
const hasScroll = ref(false);

function setCardLineStyle() {
  if (props.type !== 'card') return;
  let dom: HTMLElement = tabListRef.value?.querySelector(`span[tab-nav="${props.modelValue.toString()}"]`);
  if (!dom) return;
  cardLineStyle.width = dom.offsetWidth + 'px';
  cardLineStyle.height = dom.offsetHeight + 'px';
  cardLineStyle.left = dom.offsetLeft + 'px';
}

function navClick(name: string | number) {
  _scrollIntoView(name);
  emit('update:modelValue', name);
  emit('change', name);
}

function _scrollIntoView(name: string | number) {
  let dom: HTMLElement = tabListRef.value?.querySelector(`span[tab-nav="${name}"]`);
  dom?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function addTab(pane: PaneInstance) {
  let idx = tabList.value.findIndex((v) => v.name === pane.name);
  if (idx >= 0) {
    tabList.value.splice(idx, 1);
  }
  tabList.value.push(pane);
}

function removeTab(name: string | number) {
  let idx = tabList.value.findIndex((v) => v.name === name);
  if (idx >= 0) {
    tabList.value.splice(idx, 1);
  }
}

function scrollTo(value: number) {
  let scrollLeft = tabScrollRef.value.scrollLeft + tabScrollRef.value.offsetWidth * value;
  tabScrollRef.value.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  });
}

function update() {
  nextTick(() => {
    if (props.type === 'card') {
      setCardLineStyle();
    }
    hasScroll.value = tabScrollRef.value?.offsetWidth < tabScrollRef.value?.scrollWidth;
  });
}

watch(() => tabList.value.length, update);

watch(
  () => props.modelValue,
  (val) => {
    _scrollIntoView(val.toString());
    update();
  }
);
watch(
  () => props.type,
  (val) => {
    if (val === 'card') {
      setCardLineStyle();
    }
  }
);

onMounted(() => {
  setCardLineStyle();
});

provide(TABS_PROVIDE, {
  props,
  addTab,
  removeTab
});
</script>
