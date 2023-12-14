import request from "@/utils/request";
export function addLike(params) {
  return request({
    url: `/library/like/${params.resId}`,
    method: "post",
    params,
  });
}
export function deleteLike(params) {
  return request({
    url: `/library/like/${params.resId}`,
    method: "delete",
    params,
  });
}

export function getLikelist(params) {
  return request({
    url: `/library/like/list`,
    method: "get",
    params,
  });
}
