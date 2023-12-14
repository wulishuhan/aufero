import request from "@/utils/request";

export function postComment(data) {
  return request({
    url: "/library/comment",
    method: "post",
    data,
  });
}
