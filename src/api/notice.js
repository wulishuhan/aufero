import request from "@/utils/request";
export function getAllList(data) {
  return request({
    url: "/select/type",
    method: "get",
    data,
  });
}
export function getSystemList(data) {
  return request({
    url: "/select/type",
    method: "get",
    data,
  });
}
export function getCommentList(data) {
  return request({
    url: "/select/type",
    method: "get",
    data,
  });
}
export function getFollowList(data) {
  return request({
    url: "/select/type",
    method: "get",
    data,
  });
}

export function getNoticeMessageList(params) {
  return request({
    url: "/library/notice/message/list",
    method: "get",
    params,
  });
}

export function getNoticeMessageDetail(params) {
  return request({
    url: "/library/notice/message/detail",
    method: "get",
    params,
  });
}

export function deleteContact(talkerId) {
  return request({
    url: "/library/notice/message/delete/" + talkerId,
    method: "delete",
  });
}

export function sendMessage(data) {
  return request({
    url: "/library/notice/message/send",
    method: "post",
    data,
  });
}

//标记用户私信消息已读

export function readMessage(data) {
  return request({
    url: "/library/notice/message/read",
    method: "put",
    data,
  });
}
