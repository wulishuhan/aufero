export function broserInfo() {
  let userAgent = window.navigator.userAgent;
  let isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return "Opera";
  }
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  }
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  }
  if (userAgent.indexOf("compatible") > -1) {
    return "IE";
  }
}
