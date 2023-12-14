import i18n from "@/utils/i18n";
export function throttle(func, delay) {
  delay = delay || 1000;
  var previousDate = new Date();
  var previous = previousDate.getTime(); // 初始化一个时间，也作为高频率事件判断事件间隔的变量，通过闭包进行保存。

  return function (...args) {
    var context = this;
    var nowDate = new Date();
    var now = nowDate.getTime();
    if (now - previous >= delay) {
      // 如果本次触发和上次触发的时间间隔超过设定的时间
      func.apply(context, args); // 就执行事件处理函数 （eventHandler）
      previous = now; // 然后将本次的触发时间，作为下次触发事件的参考时间。
    }
  };
}

export function debounce(func, delay) {
  var timer = null;
  return function (...args) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    var context = this;
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * W：宽
 * H：高
 * borderWidth：border宽
 * borderColor：border颜色
 * color：背景颜色
 * textColor：文字颜色
 * fontText：圆内的文字
 *  */
export function createCanvas(
  W,
  H,
  borderWidth,
  borderColor,
  color,
  textColor,
  fontText
) {
  var canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  // 画圆
  ctx.arc(W / 2, H / 2, 55, 0, Math.PI * 2, true);
  ctx.closePath();
  // 填充背景颜色
  ctx.fillStyle = color;
  ctx.fill();

  // 填充边框颜色
  ctx.lineWidth = borderWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = borderColor;
  ctx.stroke(); //

  // 填充文字颜色
  ctx.font = "20px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.fillText(fontText, (W + borderWidth) / 2, (H + borderWidth * 2) / 2);
  // 转base64
  let res = canvas.toDataURL("image/png", 1);
  return res;
}

export function formatFileSize(filesize, rad = 2) {
  var units = "Byte";
  if (filesize / 1024 > 1) {
    filesize = filesize / 1024;
    units = "KB";
  }
  if (filesize / 1024 > 1) {
    filesize = filesize / 1024;
    units = "MB";
  }

  if (filesize / 1024 > 1) {
    filesize = filesize / 1024;
    units = "GB";
  }
  return filesize.toFixed(rad) + units;
}

export function formateDatetime(timestamp) {
  var now = new Date();
  var prev = new Date(timestamp);

  //跨年度
  if (now.getFullYear() > prev.getFullYear()) {
    return i18n.d(timestamp, "ymdhm");
  }

  //跨天
  if (now.getDate() > prev.getDate()) {
    return i18n.d(timestamp, "mdhm");
  }
  if (now - timestamp <= 3600 * 24 * 1000) {
    //一天内
    return i18n.d(timestamp, "hm");
  } else {
    //本年度内
    return i18n.d(timestamp, "mdhm");
  }
}

export function isMobile() {
  var flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|Intel Mac OS X 10_15_6)/i
  );
  //window.orientation属性用于获取屏幕的当前方向，只有移动设备才有这个属性，桌面设备会返回undefined。
  return flag || typeof window.orientation !== "undefined";
}
const language = { zh: "中文", en: "English" };

export function getLanguage(locale) {
  return language[locale];
}
