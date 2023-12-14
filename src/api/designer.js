import request from "@/utils/request";
export function getDesignerList(params) {
  return request({
    url: "/designer/list",
    method: "get",
    params,
  });
}
export function unfollowDesigner(params) {
  return request({
    url: "/designer/unfollowDesigner",
    method: "get",
    params,
  });
}
export function followDesigner(params) {
  return request({
    url: "/designer/followDesigner",
    method: "get",
    params,
  });
}
