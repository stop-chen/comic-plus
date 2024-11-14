import { ComputedRef, InjectionKey, Ref, VNode } from 'vue';
import { ScheduleProps } from './main.props';

export type Schedules = {
  time: string;
  content?: string | VNode;
  [key: string]: any;
}[];

export type Times =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export type ScheduleProvide = {
  date: Ref<Date>;
  props: ScheduleProps;
  spacing: ComputedRef<number>;
};

export type CardList = {
  startTime: number;
  endTime?: number;
  children: Schedules;
}[];

export const SCHEDULE_PROVIDE: InjectionKey<ScheduleProvide> = Symbol('SCHEDULE_PROVIDE');
