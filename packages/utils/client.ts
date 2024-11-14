import { isClient } from '@vueuse/core';

export const raf = (fn: () => void) =>
  isClient ? window.requestAnimationFrame(fn) : (setTimeout(fn, 16) as unknown as number);

export const caf = (handle: number) => (isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle));
