<template>
  <div
    class="cu-date-picker"
    :class="[{ expand: show }, { 'is-disabled': disabled }, { 'is-range': range }, currentSize]"
    v-click-outside:[popperRef]="onClickOutside"
    ref="datePickerRef">
    <div class="cu-date-picker__content" @click="handleClick">
      <span class="prefix-icon">
        <Calendar />
      </span>
      <input
        type="text"
        class="cu-input__inner"
        readonly
        :value="range ? formatDate(new Date(modelValue[0]), format) : formatDate(new Date(modelValue as Date |string | number), format)"
        :placeholder="range ? startPlaceholder : placeholder"
        :disabled="disabled" />
      <span v-if="range">{{ rangeSeparator }}</span>
      <input
        v-if="range"
        type="text"
        class="cu-input__inner"
        readonly
        :value="formatDate(new Date(modelValue[1]), format)"
        :placeholder="endPlaceholder"
        :disabled="disabled" />
      <span class="clearable" v-if="clearable">
        <CloseOne v-show="hasValue" @click.stop="clear" />
      </span>
    </div>
    <popper :show="show" :trigger="datePickerRef">
      <div class="cu-date-picker__popper" ref="popperRef" :class="[{ 'is-range': range }]">
        <date-select />
      </div>
    </popper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue';
import '../style/date-picker.css';
import '../../form-common.css';
import { FORM_PROVIDE } from '../../form/src/type';
import { CuPopper as Popper } from '../../popper';
import DateSelect from './date-select.vue';
import { useClickOutside, formatDate, useGlobal, isArray } from '../../../utils';
import { datePickerProps, datePickerEmits } from './main.props';
import { DATEPICKER_PROVIDE, type ValueType } from './type';
import { Calendar, CloseOne } from '../../../icons';
import { useItemValidate } from '../../../hooks';

defineOptions({
  name: 'CuDatePicker'
});
const props = defineProps(datePickerProps);
const emit = defineEmits(datePickerEmits);

const popperRef = ref(null);
const datePickerRef = ref();

const { globalSize } = useGlobal();
const { itemValidate } = useItemValidate();
const form = inject(FORM_PROVIDE, undefined);

const currentSize = computed(() => {
  return props.size ?? form?.props.size ?? globalSize?.value;
});

const vClickOutside = useClickOutside();

const show = ref(false);

const hasValue = computed(() => {
  if (props.range && isArray(props.modelValue)) {
    return props.modelValue.length > 0 && props.modelValue.every((val) => !!val);
  } else {
    return !!props.modelValue;
  }
});

function clear() {
  emit('update:modelValue', props.range ? [] : '');
  emit('clear');
  show.value = false;

  itemValidate('change');
}
function onClickOutside() {
  show.value && (show.value = false);
}
function handleClick() {
  if (props.disabled) return;
  show.value = !show.value;
}

function updateValue(value: number | number[]) {
  let val: ValueType;
  if (isArray(value)) {
    if (value[0] > value[1]) {
      value.reverse();
    }
  }
  switch (props.valueFormat) {
    case 'date':
      if (props.range) {
        val = [new Date(value[0]), new Date(value[1])];
      } else {
        val = new Date(value as number);
      }
      break;
    case 'string':
      if (props.range) {
        val = [formatDate(value[0], props.format), formatDate(value[1], props.format)];
      } else {
        val = formatDate(value, props.format);
      }
      break;
    case 'number':
      val = value;
      break;
    default:
      val = value;
      break;
  }
  emit('update:modelValue', val);
  itemValidate('change');
  show.value = false;
}

provide(DATEPICKER_PROVIDE, {
  props,
  show,
  confirm: updateValue
});
</script>
