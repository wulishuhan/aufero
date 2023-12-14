import request from "@/utils/request";
export function getAllList(data) {
  return request({
    url: "/select/type",
    method: "get",
    data,
  });
}
