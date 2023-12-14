import request from "@/utils/request";

export function getActivityList(params) {
  return request({
    url: `/dashboard/getActivityList`,
    method: "get",
    params,
  });
}
export function getWatchList(params) {
  return request({
    url: `/dashboard/getWatchList`,
    method: "get",
    params,
  });
}
export function getDesignerList(params) {
  return request({
    url: `/dashboard/getDesignerList`,
    method: "get",
    params,
  });
}
