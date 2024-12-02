import { ComputedRef, Ref, computed, warn } from 'vue';
import { randomColor } from '../../../utils';
import { DateItem, Schedules } from '../src/type';
import { CalendarProps } from '../src/main.props';

let temp = 1;

export function getUid(): number {
  return Date.now() + temp++;
}

function parseDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

type useSchedulesOptions = {
  year: Ref<number>;
  month: Ref<number>;
  dates: ComputedRef<DateItem[][]>;
};

export const useSchedules = (props: CalendarProps, { year, month, dates }: useSchedulesOptions) => {
  //防止初始化时props为空导致getSchedules函数报错而使用计算属性来设置一个空数组
  const scl = computed<Schedules>(() => {
    return props?.schedules || [];
  });

  const getSchedules = () => {
    let schedules = scl.value
      .map((v) => {
        //new Date生成日期在不同情况下有的是0点有的是8点 通过parseDate强制转为0点
        let start = parseDate(v.startDate);
        let end = parseDate(v.endDate ?? v.startDate);

        //如果日程中包含了 结束时间小于开始时间的日程则给出警告
        if (end.getTime() < start.getTime()) {
          warn('The schedules include options where endDate is less than startDate');
        }

        return {
          ...v,
          _uid: getUid(),
          startDate: start,
          endDate: end,
          color: v.color ?? randomColor()
        };
      })
      //需要排序一次否则后面计算位置会出问题
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    let result: DateItem[] = dates.value
      .map((week) => {
        return week.map((day) => {
          let T = day.isPrevMonth ? -1 : day.isNextMonth ? 1 : 0;
          let timeTemp = new Date(year.value, month.value + T, day.value).getTime();

          // let copy = structuredClone(schedules); //深克隆  有浏览器限制问题
          // 查找到所有包含当天的日程
          let events = schedules.filter((v) => {
            // return v.startTime <= timeTemp && v.endTime >= timeTemp;
            return v.startDate.getTime() <= timeTemp && v.endDate.getTime() >= timeTemp;
          });
          return {
            ...day,
            events: structuredClone(events)
          };
        });
      })
      .flat();

    a: for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.events.length === 0 || result[i - 1]?.events.length === 0) continue a;
      b: for (let j = 0; j < item.events.length; j++) {
        let event = item.events[j];
        let PrevEvent = result[i - 1];
        if (!PrevEvent) continue b;

        let idx = PrevEvent?.events.findIndex((v) => v._uid === event._uid);

        if (idx < 0) continue b;

        let sum = item.events.slice(0, j).reduce((acc, cur) => (acc += cur['top'] ?? 0), 0);
        let sum2 = PrevEvent.events.slice(0, idx + 1).reduce((acc, cur) => (acc += cur['top'] ?? 0), 0);

        let diff = idx - j;
        event['top'] = diff * 24 - sum + sum2;
      }
    }
    return result;
  };

  const filterSchedules = computed(() => {
    return props.openSchedule ? getSchedules() : [];
  });

  return {
    filterSchedules
  };
};
