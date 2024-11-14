<template>
  <span
    v-if="!transition"
    class="cu-tag"
    :class="[
      type ? 'cu-tag--' + type : undefined,
      tagMode ? 'is-' + tagMode : undefined,
      { 'is-border': border },
      { 'is-round': round }
    ]"
    :style="[{ '--tag-size': size + 'px' }, customStyle]">
    <span class="cu-tag-content">
      <slot></slot>
    </span>
    <component class="closeicon" v-if="closable" @click="$emit('close')" :is="tagMode ? CloseSmall : CloseOne" />
  </span>
  <transition v-else name="cu-zoom-x" appear @vue:mounted="handleVNodeMounted">
    <span
      class="cu-tag"
      :class="[
        type ? 'cu-tag--' + type : undefined,
        tagMode ? 'is-' + tagMode : undefined,
        { 'is-border': border },
        { 'is-round': round }
      ]"
      :style="[{ '--tag-size': size + 'px' }, customStyle]">
      <span class="cu-tag-content">
        <slot></slot>
      </span>
      <component class="closeicon" v-if="closable" @click="handleClose" :is="tagMode ? CloseSmall : CloseOne" />
    </span>
  </transition>
</template>

<script setup lang="ts">
import { VNode, computed } from 'vue';
import '../style/tag.css';
import { tagProps, tagEmits } from './main.props';
import { CloseOne, CloseSmall } from '../../../icons';
defineOptions({
  name: 'CuTag'
});

const props = defineProps(tagProps);
const emit = defineEmits(tagEmits);

function handleClose() {
  emit('close');
}

const tagMode = computed(() => {
  return props.plain ? 'plain' : props.light ? 'light' : undefined;
});

const customStyle = computed(() => {
  if (!props.color) return undefined;
  let calcColor =
    tagMode.value === 'plain'
      ? `color-mix(in srgb, ${props.color}, white 90%)`
      : tagMode.value === 'light'
      ? '#fff'
      : props.color;
  return {
    borderColor: props.color,
    backgroundColor: calcColor,
    color: tagMode.value ? props.color : '#fff'
  };
});

const handleVNodeMounted = (vnode: VNode) => {
  // @ts-ignore
  vnode.component.subTree.component.bum = null;
};
</script>
