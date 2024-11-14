<template>
  <button
    class="cu-button"
    :class="buttonClassList"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    :style="buttonStyle">
    <i
      class="cu-button__icon"
      :class="[{ 'is-loading': loading }]"
      :style="{ marginRight: $slots.default ? '8px' : undefined }"
      v-if="loading || icon">
      <component v-if="loading" :is="isVueComponent(loadingIcon) ? loadingIcon : Loading" />
      <component v-else-if="isVueComponent(icon)" :is="icon" />
    </i>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import '../style/button.css';
import { FORM_PROVIDE } from '../../form/src/type';
import { buttonProps, buttonEmits } from './main.props';
import { useGlobal, isVueComponent } from '../../../utils';
import { BUTTONGROUP_PROVIDE } from './type';
import { Loading } from '../../../icons';

defineOptions({
  name: 'CuButton'
});

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const { globalSize } = useGlobal();
const form = inject(FORM_PROVIDE, undefined);
const group = inject(BUTTONGROUP_PROVIDE, undefined);

const currentSize = computed(() => {
  return props.size ?? group?.props.size ?? form?.props.size ?? globalSize?.value;
});

const buttonExtraClass = computed(() => {
  return props.plain ? 'plain' : props.light ? 'light' : props.dashed ? 'dashed' : props.text ? 'text' : undefined;
});

const buttonClassList = computed(() => {
  return [
    props.type && 'cu-button--' + props.type,
    currentSize.value,
    { 'is-raised': props.raised },
    { 'is-circle': props.circle },
    { 'is-round': props.round },
    buttonExtraClass.value && 'is-' + buttonExtraClass.value
  ];
});

const buttonStyle = computed(() => {
  if (props.color) {
    if (props.plain) {
      return {
        '--cu-button-color': props.color,
        '--cu-button-color-hover': '#ffffff',
        '--cu-button-color-disabled': `color-mix(in srgb, ${props.color}, white 40%)`,
        '--cu-button-border': props.color,
        '--cu-button-border-hover': props.color,
        '--cu-button-border-disabled': `color-mix(in srgb, ${props.color}, white 40%)`,
        '--cu-button-background': `color-mix(in srgb, ${props.color}, white 90%)`,
        '--cu-button-background-hover': props.color,
        '--cu-button-background-disabled': `color-mix(in srgb, ${props.color}, white 90%)`
      };
    } else if (props.light) {
      return {
        '--cu-button-color': props.color,
        '--cu-button-color-hover': props.color,
        '--cu-button-color-disabled': `color-mix(in srgb, ${props.color}, white 40%)`,
        '--cu-button-border': props.color,
        '--cu-button-border-hover': props.color,
        '--cu-button-border-disabled': `color-mix(in srgb, ${props.color}, white 40%)`,
        '--cu-button-background-hover': `color-mix(in srgb, ${props.color}, white 90%)`,
        '--cu-button-border-active': `color-mix(in srgb, ${props.color}, white 80%)`
      };
    } else if (props.text) {
      return {
        '--cu-button-color': props.color,
        '--cu-button-color-hover': props.color,
        '--cu-button-color-disabled': `color-mix(in srgb, ${props.color}, white 40%)`,
        '--cu-button-background-hover': `color-mix(in srgb, ${props.color}, white 90%)`,
        '--cu-button-background-active': `color-mix(in srgb, ${props.color}, white 80%)`
      };
    } else if (props.dashed) {
      return {
        '--cu-button-color-hover': props.color,
        '--cu-button-border-hover': props.color,
        '--cu-button-border-active': `color-mix(in srgb, ${props.color}, white 80%)`
      };
    } else {
      return {
        '--cu-button-background': props.color,
        '--cu-button-border-hover': `color-mix(in srgb, ${props.color}, white 30%)`,
        '--cu-button-border': props.color,
        '--cu-button-background-hover': `color-mix(in srgb, ${props.color}, white 30%)`,
        '--cu-button-color': '#ffffff',
        '--cu-button-border-disabled': `color-mix(in srgb, ${props.color}, white 50%)`,
        '--cu-button-color-disabled': '#ffffff',
        '--cu-button-background-disabled': `color-mix(in srgb, ${props.color}, white 50%)`
      };
    }
  }
  return undefined;
});
</script>
