import request from "@/utils/request";

export function addCommunity(data) {
  return request({
    url: "/library/community",
    method: "post",
    data,
  });
}

export function getCommunityList(params) {
  return request({
    url: "/library/community/list",
    method: "get",
    params,
  });
}

export function getCommunityDetail(id) {
  return request({
    url: `/library/community/detail/${id}`,
    method: "get",
  });
}

//评论接口
export function getCommunityComment(params) {
  return request({
    url: "/library/community/comment/list",
    method: "get",
    params,
  });
}

//点赞接口
export function like(id) {
  return request({
    url: `/library/community/like/${id}`,
    method: "post",
  });
}

//取消点赞
export function unlike(id) {
  return request({
    url: `/library/community/like/${id}`,
    method: "delete",
  });
}

//用户点赞列表
export function getLikeList(params) {
  return request({
    url: "/library/community/like/list",
    method: "get",
    params,
  });
}

//评论
export function postComment(data) {
  return request({
    url: "/library/community/comment",
    method: "post",
    data,
  });
}

//删除评论
export function deleteComment(id) {
  return request({
    url: `/library/community/comment/${id}`,
    method: "delete",
  });
}

//评论列表
export function getCommentList(params) {
  return request({
    url: "/library/community/comment/list",
    method: "get",
    params,
  });
}
