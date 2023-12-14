import Cookies from "js-cookie";

const TokenKey = "token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  // var millisecond = new Date().getTime();
  // var expiresTime = new Date(millisecond + 60 * 1000 * 719);
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 720 * 60 * 1000);
  return Cookies.set(TokenKey, token, { expires: expirationDate });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
