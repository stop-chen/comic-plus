import { isWindow, raf, caf } from '../../../utils';

function getNextScrollTop(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

export function animateScrollTo(container: HTMLElement | Window, from: number, to: number, duration: number) {
  const startTime = Date.now();

  let handle: number | undefined;
  const scroll = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nst = getNextScrollTop(time > duration ? duration : time, from, to, duration);

    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nst);
    } else {
      container.scrollTop = nst;
    }
    if (time < duration) {
      handle = raf(scroll);
    }
  };

  scroll();

  return () => {
    handle && caf(handle);
  };
}

export function elAnimation(el: Element, duration?: number) {
  const time = 1000 + (duration ?? 0); //duration表示动画持续时间，time设置 +1000 确保动画运行结束再移除动画类名
  el.classList.add('cu-anchor--animation');
  setTimeout(() => {
    el.classList.remove('cu-anchor--animation');
  }, time);
}
