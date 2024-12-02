import { StyleValue, computed, defineComponent, h, provide } from 'vue';
import '../style/menu.css';
import { menuProps, menuEmits } from './main.props';
import { MENU_PROVIDE } from './type';

const CSSVAR = [
  '--cu-menu-bg',
  '--cu-menu-bg-active',
  '--cu-menu-bg-hover',
  '--cu-menu-textcolor',
  '--cu-menu-textcolor-active',
  '--cu-menu-textcolor-hover',
  '--cu-menu-height'
];

export const Menu = defineComponent({
  name: 'CuMenu',
  props: menuProps,
  emit: menuEmits,
  setup(props, { slots, emit }) {
    const menuClick = (name: string) => {
      emit('menu-click', name);
      emit('update:modelValue', name);
    };

    // 通过计算属性剔除不需要继承的style属性
    const getProvideStyle = computed(() => {
      return Object.entries(props.style).reduce((acc, [key, val]) => {
        if (CSSVAR.includes(key)) {
          acc[key] = val;
        }
        return acc;
      }, {} as StyleValue);
    });

    provide(MENU_PROVIDE, {
      props,
      menuClick,
      style: getProvideStyle
    });

    return () =>
      h(
        'ul',
        {
          class: [
            'cu-menu',
            props.mode ? 'is-' + props.mode : undefined,
            { 'menu-collapse': props.mode === 'vertical' && props.collapse }
          ],
          style: props.style
        },
        slots
      );
  }
});
