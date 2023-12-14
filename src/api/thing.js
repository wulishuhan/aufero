import request from "@/utils/request";

export function getThingDetails(params) {
  return request({
    url: "/thing/detail",
    method: "get",
    params,
  });
}
export function getThingDownloadInfo(params) {
  return request({
    url: "/thing/downloadInfo",
    method: "get",
    params,
  });
}

export function getUserInfoByThingId(params) {
  return request({
    url: "/thing/getUserInfo",
    method: "get",
    params,
  });
}

export function getUserMakesByThingId(params) {
  return request({
    url: "/thing/getUserMakes",
    method: "get",
    params,
  });
}

export function getUserCommentsByThingId(params) {
  return request({
    url: "/thing/getUserComments",
    method: "get",
    params,
  });
}

export function addUserComments(params) {
  return request({
    url: "/thing/addUserComments",
    method: "post",
    params,
  });
}

export function getThingList(params) {
  return request({
    url: `/thing/getThingList`,
    method: "get",
    params,
  });
}

export function changeCollect(params) {
  return request({
    url: `/thing/changeCollect`,
    method: "post",
    params,
  });
}

export function changeLike(params) {
  return request({
    url: `/thing/changeLike`,
    method: "post",
    params,
  });
}
