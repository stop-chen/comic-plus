import {  InjectionKey } from 'vue';
import { ClockProps } from './main.props';
import { UseClockReturn } from '../util/useClock';

export const NUMBER_SHOW_ENUM = [
  [true, false, true, true, true, true, true], //0
  [false, false, false, false, true, false, true], //1
  [true, true, true, false, true, true, false], //2
  [true, true, true, false, true, false, true], //3
  [false, true, false, true, true, false, true], //4
  [true, true, true, true, false, false, true], //5
  [true, true, true, true, false, true, true], //6
  [true, false, false, false, true, false, true], //7
  [true, true, true, true, true, true, true], //8
  [true, true, true, true, true, false, true] //9
];

export const NUMBER_ROMAN = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII'
};

export const COLOR_ENUM = ['primary', 'danger', 'success', 'warning', 'info'];

export type ClockProvide = {
  props: ClockProps;
} & UseClockReturn;

export const CLOCK_PROVIDE: InjectionKey<ClockProvide> = Symbol('CLOCK_PROVIDE');
