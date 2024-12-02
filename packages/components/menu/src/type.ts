import type { ComputedRef, InjectionKey, StyleValue } from 'vue';
import type { MenuProps } from './main.props';

export type MenuProvide = {
  props: MenuProps;
  style: ComputedRef<StyleValue>;
  menuClick: (name: string) => void;
  offset?: number;
};

export type MenuItem = {
  idx: string;
  active: ComputedRef<boolean>;
};

export type SubmenuProvide = {
  closeMenu: (deep?: boolean) => void;
  setMenu: (item: MenuItem) => void;
  removeMenu: (idx: string) => void;
  offset?: number;
};

export const MENU_PROVIDE: InjectionKey<MenuProvide> = Symbol('MENU_PROVIDE');
