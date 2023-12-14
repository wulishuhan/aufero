import request from "@/utils/request";
export function getBanner(params) {
  return request({
    url: "/library/banner",
    method: "get",
    params,
  });
}
