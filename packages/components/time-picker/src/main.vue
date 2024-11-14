<template>
  <div class="cu-time-picker"
    :class="[{ expand: show }, { 'is-disabled': disabled }, { 'is-range': range }, currentSize]"
    v-click-outside:[popperRef]="onClickOutside" ref="timePickerRef">
    <div class="cu-time-picker__content" @click="handleClick">
      <span class="prefix-icon">
        <Time />
      </span>
      <input class="cu-input__inner" type="text" readonly :value="range ? modelValue[0] : modelValue"
        :placeholder="range ? startPlaceholder : placeholder" :disabled="disabled" />
      <span v-if="range">{{ rangeSeparator }}</span>
      <input v-if="range" class="cu-input__inner" type="text" readonly :value="modelValue[1]"
        :placeholder="endPlaceholder" :disabled="disabled" />
      <span class="suffix-icon" v-if="clearable">
        <CloseOne class="clearable" v-show="hasValue" @click.stop="clear" />
      </span>
    </div>

    <popper :show="show" :trigger="timePickerRef">
      <div class="cu-time-picker__popper" ref="popperRef" :class="{ range }">
        <time-select />
      </div>
    </popper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue';
import '../style/time-picker.css';
import '../../form-common.css';
import { FORM_PROVIDE } from '../../form/src/type';
import { CuPopper as Popper } from '../../popper';
import timeSelect from './time-select.vue';
import { useGlobal, useClickOutside, isArray } from '../../../utils';
import { useItemValidate } from '../../../hooks';
import { timePickerProps, timePickerEmits } from './main.props';
import { TIMEPICKER_PROVIDE } from './type';
import { CloseOne, Time } from '../../../icons';

defineOptions({
  name: 'CuTimePicker'
});
const props = defineProps(timePickerProps);
const emit = defineEmits(timePickerEmits);

const popperRef = ref(null);
const timePickerRef = ref();
const { itemValidate } = useItemValidate();
const { globalSize } = useGlobal();
const form = inject(FORM_PROVIDE, undefined);

const currentSize = computed(() => {
  return props.size ?? form?.props.size ?? globalSize?.value;
});

const hasValue = computed(() => {
  if (props.range && isArray(props.modelValue)) {
    return props.modelValue.length > 0 && props.modelValue.every((val) => !!val);
  } else {
    return !!props.modelValue;
  }
});

const show = ref(false);

const vClickOutside = useClickOutside();

function onClickOutside() {
  show.value && (show.value = false);
}

function handleClick() {
  show.value = !show.value;
}

function clear() {
  emit('update:modelValue', props.range ? [] : '');
  change(props.range ? [] : '');
  emit('clear');
}

function confirmTime(value: string | string[]) {
  emit('update:modelValue', value);
  change(value);
  show.value = false;
}

function change(val: string | string[]) {
  emit('change', val);
  itemValidate('change');
}

provide(TIMEPICKER_PROVIDE, {
  props,
  show,
  confirm: confirmTime
});
</script>
