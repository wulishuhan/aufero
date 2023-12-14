import request from "@/utils/request";

export function follow(params) {
  return request({
    url: `/library/follower`,
    method: "post",
    params,
  });
}
export function unFollow(params) {
  return request({
    url: `/library/follower`,
    method: "delete",
    params,
  });
}
export function renameCollection(data) {
  return request({
    url: `/library/collection`,
    method: "put",
    data,
  });
}
export function addCollection(data) {
  return request({
    url: `/library/collection`,
    method: "post",
    data,
  });
}
export function deleteResource(params) {
  return request({
    url: `/library/resource/${params.resId}`,
    method: "delete",
  });
}
export function deleteMake(params) {
  return request({
    url: `/library/comment/${params.resId}`,
    method: "delete",
  });
}
export function moveResourceToCollection(params) {
  return request({
    url: `/library/collection/${params.collectionId}/resource/${params.resourceId}`,
    method: "put",
  });
}
export function addResourceToCollection(params) {
  return request({
    url: `/library/collection/${params.collectionId}/resource/${params.resourceId}`,
    method: "post",
  });
}
export function deleteCollection(params) {
  return request({
    url: `/library/collection/${params.collectionId}`,
    method: "delete",
  });
}
export function getCollectList(params) {
  return request({
    url: `/library/collection/list`,
    method: "get",
    params,
  });
}
export function getHistoriesList(params) {
  return request({
    url: `/library/history/list`,
    method: "get",
    params,
  });
}
export function delHistories(id) {
  return request({
    url: `/library/history/` + id,
    method: "delete",
  });
}
export function delsHistories(params) {
  return request({
    url: `/library/history`,
    method: "delete",
    params,
  });
}
export function getCollectResourceList(params) {
  return request({
    url: `/library/collection/${params.collectionId}/resource/list`,
    method: "get",
    params,
  });
}
export function cancelCollectResource(params) {
  return request({
    url: `/library/collection/${params.collectionId}/resource/${params.resId}`,
    method: "delete",
    params,
  });
}
export function getResourceList(params) {
  return request({
    url: `/library/resource/list`,
    method: "get",
    params,
  });
}
export function getLikesList(params) {
  return request({
    url: `/library/like/list`,
    method: "get",
    params,
  });
}
export function getFollowingList(params) {
  return request({
    url: `/library/follower/followings`,
    method: "get",
    params,
  });
}
export function getFollowerList(params) {
  return request({
    url: `/library/follower/followers`,
    method: "get",
    params,
  });
}

export function updateDiy(data) {
  return request({
    url: `/library/author/profile`,
    method: "put",
    data,
  });
}
export function getProfile(data) {
  return request({
    url: `/library/author/profile/${data}`,
    method: "get",
  });
}

export function SortCollection(data) {
  return request({
    url: `/library/collection/sort`,
    method: "put",
    data,
  });
}
