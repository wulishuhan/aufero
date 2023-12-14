import request from "@/utils/request";
export function getGroupsList(params) {
  return request({
    url: "/groups/list",
    method: "get",
    params,
  });
}

export function getGroupsMembers(params) {
  return request({
    url: "/groups/members",
    method: "get",
    params,
  });
}

export function getGroupsInfo(params) {
  return request({
    url: "/groups/info",
    method: "get",
    params,
  });
}

export function getGroupThings(params) {
  return request({
    url: "/groups/thingsInfo",
    method: "get",
    params,
  });
}

export function getGroupAboutInfo(params) {
  return request({
    url: "/groups/groupAboutInfo",
    method: "get",
    params,
  });
}

export function changeUserGroupStatus(params) {
  return request({
    url: "/groups/changeUserGroup",
    method: "post",
    params,
  });
}

export function createGroup(params) {
  return request({
    url: "/groups/createGroup",
    method: "post",
    params,
  });
}
