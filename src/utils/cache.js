// 防抖(在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时)
export function debounce(f, t, im = false) {
  let timer,
    flag = true;
  return (...args) => {
    // 需要立即执行的情况
    if (im) {
      if (flag) {
        f(...args);
        flag = false;
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          f(...args);
          flag = true;
        }, t);
      }
    } else {
      // 非立即执行的情况
      clearTimeout(timer);
      timer = setTimeout(() => {
        f(...args);
      }, t);
    }
  };
}

// 节流(规定在一个单位时间内，只能触发一次函数，如果这个单位时间内触发多次函数，只有一次生效)
export function throttle(f, t, im = false) {
  let flag = true;
  return (...args) => {
    if (flag) {
      flag = false;
      im && f(...args);
      setTimeout(() => {
        !im && f(...args);
        flag = true;
      }, t);
    }
  };
}
