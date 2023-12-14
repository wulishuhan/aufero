import request from "@/utils/request";
export function saveResource(data) {
  return request({
    url: `library/resource`,
    method: "post",
    data,
  });
}
export function getResource(id) {
  return request({
    url: `library/resource/detail/${id}`,
    method: "get",
  });
}
export function updateResource(data) {
  return request({
    url: `library/resource`,
    method: "put",
    data,
  });
}
export function getResourceList(params) {
  return request({
    url: `/library/resource/search`,
    method: "get",
    params,
  });
}
export function getResourceListById(params) {
  return request({
    url: `/library/resource/list`,
    method: "get",
    params,
  });
}

export function getMoreByThisCreator(params) {
  return request({
    url: `/library/resource/list/creator`,
    method: "get",
    params,
  });
}

export function getSimilar(params) {
  return request({
    url: `/library/resource/list/similar`,
    method: "get",
    params,
  });
}

export function getResourceTags(params) {
  return request({
    url: `/library/tag/list`,
    method: "get",
    params,
  });
}

export function getAuthorList(params) {
  return request({
    url: `/library/author/search`,
    method: "get",
    params,
  });
}

export function uploadFile(formData) {
  return request({
    url: `/library/resource/upload`,
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    data: formData,
  });
}

export function getResouceUploadS3Url(data) {
  return request({
    url: "/library/resource/uploadS3",
    method: "post",
    data,
  });
}

/**
 *
 * @param  params 获取关注的资源列表
 */
export function getFollowResourceList(params) {
  return request({
    url: "/library/resource/follow/list",
    method: "get",
    params,
  });
}
