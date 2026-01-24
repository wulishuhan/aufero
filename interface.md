# 接口入参/出参说明

以下接口均来自项目文件 `src/api/collection.js` 与 `src/api/resource.js`，按功能分组。对每个接口给出：HTTP 方法、URL、路径/查询/请求体入参（JSON Schema 风格）和常见响应结构说明。

**集合（Collection）相关**

- GET /library/collection/list
  - 请求（query）:
    - userId: string|number
  - 响应示例: res.data.data => Array<Collection>
  - Collection:
    {
      id: number,
      name?: string,
      userId?: number,
      createdAt?: string
    }

- POST /library/collection
  - 请求（body）:
    {
      name: string,
      userId: number
    }
  - 响应: 创建结果（通常返回新建对象或成功状态）

# API 清单（JSON 格式）

本文件覆盖并列出 `src/api` 下所有接口。每个接口给出：`name`、`method`、`url`、`request`（可含 `params` 与 `json` / path）、`response`（JSON 示例）、以及 `example`（请求示例与响应示例）。

[
  {
    "name": "getBanner",
    "method": "GET",
    "url": "/library/banner",
    "request": { "params": { "optional": ["position","pageNum","pageSize"] } },
    "response": { "data": [{ "title": "string", "image": "string", "url": "string" }] },
    "example": {
      "request": "GET /library/banner",
      "response": { "code": 0, "data": [{ "title": "Welcome", "image": "https://.../img.jpg", "url": "https://..." }] }
    }
  },
  {
    "name": "getCollectionList",
    "method": "GET",
    "url": "/library/collection/list",
    "request": { "params": { "userId": "number" } },
    "response": { "data": [{ "id": 1, "name": "MyFolder", "userId": 123 }] },
    "example": {
      "request": "GET /library/collection/list?userId=123",
      "response": { "code": 0, "data": [{ "id": 1, "name": "MyFolder", "userId": 123 }] }
    }
  },
  {
    "name": "addCollection",
    "method": "POST",
    "url": "/library/collection",
    "request": { "json": { "name": "string", "userId": "number" } },
    "response": { "data": { "id": 2, "name": "New Folder", "userId": 123 } },
    "example": {
      "request": { "method": "POST", "path": "/library/collection", "body": { "name": "New Folder", "userId": 123 } },
      "response": { "code": 0, "data": { "id": 2, "name": "New Folder", "userId": 123 } }
    }
  },
  {
    "name": "addResourceToCollection",
    "method": "POST",
    "url": "/library/collection/{collectionId}/resource/{resourceId}",
    "request": { "path": { "collectionId": "number", "resourceId": "number" }, "json": {} },
    "response": { "message": "string" },
    "example": {
      "request": "POST /library/collection/1/resource/100",
      "response": { "code": 0, "message": "added" }
    }
  },
  {
    "name": "deleteResourceInCollection",
    "method": "DELETE",
    "url": "/library/collection/{collectionId}/resource/{resourceId}",
    "request": { "path": { "collectionId": "number", "resourceId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/collection/1/resource/100", "response": { "code": 0, "message": "deleted" } }
  },
  {
    "name": "getResourceInCollection",
    "method": "GET",
    "url": "/library/collection/{collectionId}/resource/list",
    "request": { "path": { "collectionId": "number" }, "params": { "userId": "number", "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [ { "id": 100, "title": "string" } ], "total": 1 } },
    "example": { "request": "GET /library/collection/1/resource/list?userId=123&pageNum=1&pageSize=12", "response": { "code": 0, "data": { "rows": [{ "id": 100, "title": "MyRes" }], "total": 1 } } }
  },
  {
    "name": "getCollectionResourceList",
    "method": "GET",
    "url": "/library/collection/resource/list",
    "request": { "params": { "collectionId": "number", "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/collection/resource/list?collectionId=1&pageNum=1&pageSize=12", "response": { "code": 0, "data": { "rows": [], "total": 0 } } }
  },
  {
    "name": "deleteCollectionResource",
    "method": "DELETE",
    "url": "/library/collection/resource/{resourceId}",
    "request": { "path": { "resourceId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/collection/resource/100", "response": { "code": 0, "message": "deleted" } }
  },
  {
    "name": "postComment",
    "method": "POST",
    "url": "/library/comment",
    "request": { "json": { "resourceId": "number", "content": "string", "userId": "number?" } },
    "response": { "data": { "id": 501, "content": "string", "resourceId": 100 } },
    "example": { "request": { "method": "POST", "path": "/library/comment", "body": { "resourceId": 100, "content": "Nice!" } }, "response": { "code": 0, "data": { "id": 501 } } }
  },
  {
    "name": "addCommunity",
    "method": "POST",
    "url": "/library/community",
    "request": { "json": { "title": "string", "content": "string", "userId": "number" } },
    "response": { "data": { "id": 10 } },
    "example": { "request": "POST /library/community", "response": { "code": 0, "data": { "id": 10 } } }
  },
  {
    "name": "getCommunityList",
    "method": "GET",
    "url": "/library/community/list",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/community/list?pageNum=1&pageSize=10", "response": { "code":0, "data": { "rows": [], "total": 0 } } }
  },
  {
    "name": "getCommunityDetail",
    "method": "GET",
    "url": "/library/community/detail/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "data": { "id": 10, "title": "string", "content": "string" } },
    "example": { "request": "GET /library/community/detail/10", "response": { "code":0, "data": { "id":10 } } }
  },
  {
    "name": "getCommunityComment",
    "method": "GET",
    "url": "/library/community/comment/list",
    "request": { "params": { "communityId": "number", "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/community/comment/list?communityId=10&pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "likeCommunity",
    "method": "POST",
    "url": "/library/community/like/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /library/community/like/10", "response": { "code":0, "message":"liked" } }
  },
  {
    "name": "unlikeCommunity",
    "method": "DELETE",
    "url": "/library/community/like/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/community/like/10", "response": { "code":0, "message":"unliked" } }
  },
  {
    "name": "getLikeList",
    "method": "GET",
    "url": "/library/community/like/list",
    "request": { "params": { "userId": "number", "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/community/like/list?userId=123", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "postCommunityComment",
    "method": "POST",
    "url": "/library/community/comment",
    "request": { "json": { "communityId": "number", "content": "string", "userId": "number" } },
    "response": { "data": { "id": 200 } },
    "example": { "request": "POST /library/community/comment", "response": { "code":0, "data": { "id":200 } } }
  },
  {
    "name": "deleteCommunityComment",
    "method": "DELETE",
    "url": "/library/community/comment/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/community/comment/200", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "getActivityList",
    "method": "GET",
    "url": "/dashboard/getActivityList",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /dashboard/getActivityList?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getWatchList",
    "method": "GET",
    "url": "/dashboard/getWatchList",
    "request": { "params": {} },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /dashboard/getWatchList", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getDesignerList_dashboard",
    "method": "GET",
    "url": "/dashboard/getDesignerList",
    "request": { "params": {} },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /dashboard/getDesignerList", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "follow",
    "method": "POST",
    "url": "/library/follower",
    "request": { "params": { "userId": "number", "targetId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /library/follower?userId=123&targetId=456", "response": { "code":0, "message":"followed" } }
  },
  {
    "name": "unFollow",
    "method": "DELETE",
    "url": "/library/follower",
    "request": { "params": { "userId": "number", "targetId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/follower?userId=123&targetId=456", "response": { "code":0, "message":"unfollowed" } }
  },
  {
    "name": "renameCollection",
    "method": "PUT",
    "url": "/library/collection",
    "request": { "json": { "id": "number", "name": "string" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/collection", "response": { "code":0, "message":"renamed" } }
  },
  {
    "name": "addCollection_design",
    "method": "POST",
    "url": "/library/collection",
    "request": { "json": { "name": "string", "userId": "number" } },
    "response": { "data": { "id": 3 } },
    "example": { "request": "POST /library/collection", "response": { "code":0, "data": { "id":3 } } }
  },
  {
    "name": "deleteResource",
    "method": "DELETE",
    "url": "/library/resource/{resId}",
    "request": { "path": { "resId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/resource/100", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "deleteMake",
    "method": "DELETE",
    "url": "/library/comment/{resId}",
    "request": { "path": { "resId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/comment/501", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "moveResourceToCollection",
    "method": "PUT",
    "url": "/library/collection/{collectionId}/resource/{resourceId}",
    "request": { "path": { "collectionId": "number", "resourceId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/collection/1/resource/100", "response": { "code":0, "message":"moved" } }
  },
  {
    "name": "addResourceToCollection_design",
    "method": "POST",
    "url": "/library/collection/{collectionId}/resource/{resourceId}",
    "request": { "path": { "collectionId": "number", "resourceId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /library/collection/1/resource/101", "response": { "code":0, "message":"added" } }
  },
  {
    "name": "deleteCollection",
    "method": "DELETE",
    "url": "/library/collection/{collectionId}",
    "request": { "path": { "collectionId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/collection/2", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "getCollectList",
    "method": "GET",
    "url": "/library/collection/list",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/collection/list?userId=123", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getHistoriesList",
    "method": "GET",
    "url": "/library/history/list",
    "request": { "params": { "userId": "number", "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/history/list?userId=123", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "delHistories",
    "method": "DELETE",
    "url": "/library/history/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/history/5", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "delsHistories",
    "method": "DELETE",
    "url": "/library/history",
    "request": { "params": { "ids": "array" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/history?ids=1,2,3", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "getCollectResourceList",
    "method": "GET",
    "url": "/library/collection/{collectionId}/resource/list",
    "request": { "path": { "collectionId": "number" }, "params": { "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/collection/1/resource/list", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "cancelCollectResource",
    "method": "DELETE",
    "url": "/library/collection/{collectionId}/resource/{resId}",
    "request": { "path": { "collectionId": "number", "resId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/collection/1/resource/100", "response": { "code":0, "message":"removed" } }
  },
  {
    "name": "getResourceList_design",
    "method": "GET",
    "url": "/library/resource/list",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/resource/list?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getLikesList",
    "method": "GET",
    "url": "/library/like/list",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/like/list?userId=123", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getFollowingList",
    "method": "GET",
    "url": "/library/follower/followings",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/follower/followings?userId=123", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getFollowerList",
    "method": "GET",
    "url": "/library/follower/followers",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/follower/followers?userId=123", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "updateDiy",
    "method": "PUT",
    "url": "/library/author/profile",
    "request": { "json": { "id": "number", "description": "string", "facebook": "string", "twitter": "string" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/author/profile", "response": { "code":0, "message":"updated" } }
  },
  {
    "name": "getProfile",
    "method": "GET",
    "url": "/library/author/profile/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "data": { "id": 1, "name": "Author" } },
    "example": { "request": "GET /library/author/profile/1", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "SortCollection",
    "method": "PUT",
    "url": "/library/collection/sort",
    "request": { "json": { "order": "array" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/collection/sort", "response": { "code":0, "message":"sorted" } }
  },
  {
    "name": "getDesignerList",
    "method": "GET",
    "url": "/designer/list",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /designer/list?pageNum=1", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "unfollowDesigner",
    "method": "GET",
    "url": "/designer/unfollowDesigner",
    "request": { "params": { "designerId": "number", "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "GET /designer/unfollowDesigner?designerId=5", "response": { "code":0, "message":"unfollowed" } }
  },
  {
    "name": "followDesigner",
    "method": "GET",
    "url": "/designer/followDesigner",
    "request": { "params": { "designerId": "number", "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "GET /designer/followDesigner?designerId=5", "response": { "code":0, "message":"followed" } }
  },
  {
    "name": "getAllList_filter",
    "method": "GET",
    "url": "/select/type",
    "request": { "params": {} },
    "response": { "data": [] },
    "example": { "request": "GET /select/type", "response": { "code":0, "data": [] } }
  },
  {
    "name": "getGroupsList",
    "method": "GET",
    "url": "/groups/list",
    "request": { "params": { "pageNum": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /groups/list", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getGroupsMembers",
    "method": "GET",
    "url": "/groups/members",
    "request": { "params": { "groupId": "number" } },
    "response": { "data": { "members": [] } },
    "example": { "request": "GET /groups/members?groupId=1", "response": { "code":0, "data": { "members": [] } } }
  },
  {
    "name": "getGroupsInfo",
    "method": "GET",
    "url": "/groups/info",
    "request": { "params": { "groupId": "number" } },
    "response": { "data": { "id": 1, "name": "Group" } },
    "example": { "request": "GET /groups/info?groupId=1", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "getGroupThings",
    "method": "GET",
    "url": "/groups/thingsInfo",
    "request": { "params": { "groupId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /groups/thingsInfo?groupId=1", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getGroupAboutInfo",
    "method": "GET",
    "url": "/groups/groupAboutInfo",
    "request": { "params": { "groupId": "number" } },
    "response": { "data": { "about": "string" } },
    "example": { "request": "GET /groups/groupAboutInfo?groupId=1", "response": { "code":0, "data": { "about": "..." } } }
  },
  {
    "name": "changeUserGroupStatus",
    "method": "POST",
    "url": "/groups/changeUserGroup",
    "request": { "params": { "groupId": "number", "userId": "number", "status": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /groups/changeUserGroup?groupId=1&userId=123&status=join", "response": { "code":0 } }
  },
  {
    "name": "createGroup",
    "method": "POST",
    "url": "/groups/createGroup",
    "request": { "params": { "name": "string", "ownerId": "number" } },
    "response": { "data": { "id": 2 } },
    "example": { "request": "POST /groups/createGroup?name=NewGroup&ownerId=123", "response": { "code":0, "data": { "id":2 } } }
  },
  {
    "name": "addLike",
    "method": "POST",
    "url": "/library/like/{resId}",
    "request": { "path": { "resId": "number" }, "params": { "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /library/like/100?userId=123", "response": { "code":0, "message":"liked" } }
  },
  {
    "name": "deleteLike",
    "method": "DELETE",
    "url": "/library/like/{resId}",
    "request": { "path": { "resId": "number" }, "params": { "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/like/100?userId=123", "response": { "code":0, "message":"unliked" } }
  },
  {
    "name": "getLikelist",
    "method": "GET",
    "url": "/library/like/list",
    "request": { "params": { "userId": "number", "pageNum": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/like/list?userId=123", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getAllList_notice",
    "method": "GET",
    "url": "/select/type",
    "request": { "params": {} },
    "response": { "data": [] },
    "example": { "request": "GET /select/type", "response": { "code":0, "data": [] } }
  },
  {
    "name": "getNoticeMessageList",
    "method": "GET",
    "url": "/library/notice/message/list",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/notice/message/list?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getNoticeMessageDetail",
    "method": "GET",
    "url": "/library/notice/message/detail",
    "request": { "params": { "messageId": "number" } },
    "response": { "data": { "id": 1, "content": "string" } },
    "example": { "request": "GET /library/notice/message/detail?messageId=1", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "deleteContact",
    "method": "DELETE",
    "url": "/library/notice/message/delete/{talkerId}",
    "request": { "path": { "talkerId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /library/notice/message/delete/456", "response": { "code":0, "message":"deleted" } }
  },
  {
    "name": "sendMessage",
    "method": "POST",
    "url": "/library/notice/message/send",
    "request": { "json": { "toUserId": "number", "content": "string" } },
    "response": { "data": { "id": 1001 } },
    "example": { "request": "POST /library/notice/message/send", "response": { "code":0, "data": { "id":1001 } } }
  },
  {
    "name": "readMessage",
    "method": "PUT",
    "url": "/library/notice/message/read",
    "request": { "json": { "messageIds": "array" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/notice/message/read", "response": { "code":0, "message":"read" } }
  },
  {
    "name": "saveResource",
    "method": "POST",
    "url": "/library/resource",
    "request": { "json": { "title": "string", "description": "string", "tags": "array", "authorId": "number" } },
    "response": { "data": { "id": 100 } },
    "example": { "request": "POST /library/resource", "response": { "code":0, "data": { "id":100 } } }
  },
  {
    "name": "getResource",
    "method": "GET",
    "url": "/library/resource/detail/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "data": { "id": 100, "title": "string" } },
    "example": { "request": "GET /library/resource/detail/100", "response": { "code":0, "data": { "id":100 } } }
  },
  {
    "name": "updateResource",
    "method": "PUT",
    "url": "/library/resource",
    "request": { "json": { "id": "number", "title": "string" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/resource", "response": { "code":0, "message":"updated" } }
  },
  {
    "name": "getResourceList",
    "method": "GET",
    "url": "/library/resource/search",
    "request": { "params": { "pageNum": "number", "pageSize": "number", "sort": "string" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/resource/search?pageNum=1&sort=popular", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getResourceListById",
    "method": "GET",
    "url": "/library/resource/list",
    "request": { "params": { } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/resource/list?creatorId=5", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getMoreByThisCreator",
    "method": "GET",
    "url": "/library/resource/list/creator",
    "request": { "params": { "creatorId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/resource/list/creator?creatorId=5", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getSimilar",
    "method": "GET",
    "url": "/library/resource/list/similar",
    "request": { "params": { "resourceId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/resource/list/similar?resourceId=100", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getResourceTags",
    "method": "GET",
    "url": "/library/tag/list",
    "request": { "params": {} },
    "response": { "data": [ { "id":1, "name":"tag" } ] },
    "example": { "request": "GET /library/tag/list", "response": { "code":0, "data": [ { "id":1, "name":"tag" } ] } }
  },
  {
    "name": "getAuthorList",
    "method": "GET",
    "url": "/library/author/search",
    "request": { "params": { "q": "string" } },
    "response": { "data": [ { "id":1, "name":"Author" } ] },
    "example": { "request": "GET /library/author/search?q=smith", "response": { "code":0, "data": [ { "id":1, "name":"Author" } ] } }
  },
  {
    "name": "uploadFile",
    "method": "POST",
    "url": "/library/resource/upload",
    "request": { "formData": { "file": "File" } },
    "response": { "data": { "url": "string", "id": "number" } },
    "example": { "request": "POST /library/resource/upload (multipart/form-data)", "response": { "code":0, "data": { "url":"https://.../f.png" } } }
  },
  {
    "name": "getResouceUploadS3Url",
    "method": "POST",
    "url": "/library/resource/uploadS3",
    "request": { "json": { "filename": "string", "contentType": "string" } },
    "response": { "data": { "uploadUrl": "string", "fields": {} } },
    "example": { "request": "POST /library/resource/uploadS3", "response": { "code":0, "data": { "uploadUrl":"https://s3..." } } }
  },
  {
    "name": "getFollowResourceList",
    "method": "GET",
    "url": "/library/resource/follow/list",
    "request": { "params": { "pageNum": "number", "pageSize": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/resource/follow/list?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getAllList_setting",
    "method": "GET",
    "url": "/select/type",
    "request": { "params": {} },
    "response": { "data": [] },
    "example": { "request": "GET /select/type", "response": { "code":0, "data": [] } }
  },
  {
    "name": "changeName",
    "method": "POST",
    "url": "/system/user/changeUserInfo",
    "request": { "json": { "name": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /system/user/changeUserInfo", "response": { "code":0, "message":"ok" } }
  },
  {
    "name": "changePassword",
    "method": "POST",
    "url": "/system/user/changePassword",
    "request": { "json": { "oldPassword":"string", "newPassword":"string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /system/user/changePassword", "response": { "code":0 } }
  },
  {
    "name": "changeEmail",
    "method": "POST",
    "url": "/system/user/changeEmail",
    "request": { "json": { "email": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /system/user/changeEmail", "response": { "code":0 } }
  },
  {
    "name": "getProfileList",
    "method": "GET",
    "url": "/library/author/profile/{id}",
    "request": { "path": { "id": "number" } },
    "response": { "data": { "id":1, "description":"string" } },
    "example": { "request": "GET /library/author/profile/1", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "updateProfileList",
    "method": "PUT",
    "url": "/library/author/profile",
    "request": { "json": { "id": "number", "description": "string" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/author/profile", "response": { "code":0 } }
  },
  {
    "name": "getThingDetails",
    "method": "GET",
    "url": "/thing/detail",
    "request": { "params": { "id": "number" } },
    "response": { "data": { "id": 1, "title": "string" } },
    "example": { "request": "GET /thing/detail?id=1", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "getThingDownloadInfo",
    "method": "GET",
    "url": "/thing/downloadInfo",
    "request": { "params": { "id": "number" } },
    "response": { "data": { "downloadUrl": "string" } },
    "example": { "request": "GET /thing/downloadInfo?id=1", "response": { "code":0, "data": { "downloadUrl":"https://..." } } }
  },
  {
    "name": "getUserInfoByThingId",
    "method": "GET",
    "url": "/thing/getUserInfo",
    "request": { "params": { "thingId": "number" } },
    "response": { "data": { "user": {} } },
    "example": { "request": "GET /thing/getUserInfo?thingId=1", "response": { "code":0, "data": { "user": {} } } }
  },
  {
    "name": "getUserMakesByThingId",
    "method": "GET",
    "url": "/thing/getUserMakes",
    "request": { "params": { "thingId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /thing/getUserMakes?thingId=1", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "getUserCommentsByThingId",
    "method": "GET",
    "url": "/thing/getUserComments",
    "request": { "params": { "thingId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /thing/getUserComments?thingId=1", "response": { "code":0, "data": { "rows": [] } } }
  },
  {
    "name": "addUserComments",
    "method": "POST",
    "url": "/thing/addUserComments",
    "request": { "params": { "thingId": "number", "content": "string" } },
    "response": { "data": { "id": 1 } },
    "example": { "request": "POST /thing/addUserComments?thingId=1&content=Nice", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "getThingList",
    "method": "GET",
    "url": "/thing/getThingList",
    "request": { "params": { "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /thing/getThingList?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "changeCollect",
    "method": "POST",
    "url": "/thing/changeCollect",
    "request": { "params": { "thingId": "number", "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /thing/changeCollect?thingId=1&userId=123", "response": { "code":0 } }
  },
  {
    "name": "changeLike",
    "method": "POST",
    "url": "/thing/changeLike",
    "request": { "params": { "thingId": "number", "userId": "number" } },
    "response": { "message": "string" },
    "example": { "request": "POST /thing/changeLike?thingId=1&userId=123", "response": { "code":0 } }
  },
  {
    "name": "getUserList",
    "method": "GET",
    "url": "/user/list",
    "request": { "params": { "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /user/list?pageNum=1", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "Login",
    "method": "POST",
    "url": "/auth/user/login",
    "request": { "json": { "username": "string", "password": "string" } },
    "response": { "data": { "token": "string", "user": { "id": 123 } } },
    "example": { "request": "POST /auth/user/login", "response": { "code":0, "data": { "token":"abc", "user": { "id":123 } } } }
  },
  {
    "name": "Logout",
    "method": "DELETE",
    "url": "/auth/user/logout",
    "request": { "json": { } },
    "response": { "message": "string" },
    "example": { "request": "DELETE /auth/user/logout", "response": { "code":0 } }
  },
  {
    "name": "getUserInfo",
    "method": "GET",
    "url": "/system/user/getUserInfo",
    "request": {},
    "response": { "data": { "id": 123, "username": "user" } },
    "example": { "request": "GET /system/user/getUserInfo", "response": { "code":0, "data": { "id":123 } } }
  },
  {
    "name": "refresh",
    "method": "POST",
    "url": "/user/refresh",
    "request": {},
    "response": { "data": { "token": "string" } },
    "example": { "request": "POST /user/refresh", "response": { "code":0, "data": { "token":"abc" } } }
  },
  {
    "name": "getUserInfoByUserId",
    "method": "GET",
    "url": "/user/getUserInfoByUserId",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "id": 123, "username": "user" } },
    "example": { "request": "GET /user/getUserInfoByUserId?userId=123", "response": { "code":0, "data": { "id":123 } } }
  },
  {
    "name": "updateUserProfile",
    "method": "POST",
    "url": "/user/updateProfile",
    "request": { "params": { "displayName": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /user/updateProfile?displayName=Bob", "response": { "code":0 } }
  },
  {
    "name": "postUserMessage",
    "method": "POST",
    "url": "/user/postUserMessage",
    "request": { "params": { "toUserId": "number", "content": "string" } },
    "response": { "data": { "id": 1 } },
    "example": { "request": "POST /user/postUserMessage?toUserId=123&content=Hi", "response": { "code":0, "data": { "id":1 } } }
  },
  {
    "name": "findFollowsByUserId",
    "method": "GET",
    "url": "/user/getFollowsByUserId",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /user/getFollowsByUserId?userId=123", "response": { "code":0 } }
  },
  {
    "name": "getFollowingList_user",
    "method": "GET",
    "url": "/library/follower/followings",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/follower/followings?userId=123", "response": { "code":0 } }
  },
  {
    "name": "register",
    "method": "POST",
    "url": "/auth/user/register",
    "request": { "json": { "username": "string", "password": "string", "email": "string" } },
    "response": { "data": { "id": 123 } },
    "example": { "request": "POST /auth/user/register", "response": { "code":0, "data": { "id":123 } } }
  },
  {
    "name": "getCommentList",
    "method": "GET",
    "url": "/library/comment/list",
    "request": { "params": { "resourceId": "number", "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/comment/list?resourceId=100", "response": { "code":0, "data": { "rows": [], "total":0 } } }
  },
  {
    "name": "getCommentListFromId",
    "method": "GET",
    "url": "/library/comment/detail/{commentId}",
    "request": { "path": { "commentId": "number" } },
    "response": { "data": { "id": 501, "content": "string" } },
    "example": { "request": "GET /library/comment/detail/501", "response": { "code":0, "data": { "id":501 } } }
  },
  {
    "name": "postComment_user",
    "method": "POST",
    "url": "/library/comment",
    "request": { "json": { "resourceId": "number", "content": "string" } },
    "response": { "data": { "id": 502 } },
    "example": { "request": "POST /library/comment", "response": { "code":0, "data": { "id":502 } } }
  },
  {
    "name": "getMakeList",
    "method": "GET",
    "url": "/library/comment/make/list",
    "request": { "params": { "userId": "number" } },
    "response": { "data": { "rows": [] } },
    "example": { "request": "GET /library/comment/make/list?userId=123", "response": { "code":0 } }
  },
  {
    "name": "getMakeDetail",
    "method": "GET",
    "url": "/library/comment/detail/{commentId}",
    "request": { "path": { "commentId": "number" } },
    "response": { "data": { "id": 501 } },
    "example": { "request": "GET /library/comment/detail/501", "response": { "code":0 } }
  },
  {
    "name": "getCommentUploadS3Url",
    "method": "POST",
    "url": "/library/comment/uploadS3",
    "request": { "json": { "filename": "string" } },
    "response": { "data": { "uploadUrl": "string" } },
    "example": { "request": "POST /library/comment/uploadS3", "response": { "code":0, "data": { "uploadUrl":"..." } } }
  },
  {
    "name": "openLogin",
    "method": "POST",
    "url": "/auth/user/openLogin",
    "request": { "json": { } },
    "response": { "data": {} },
    "example": { "request": "POST /auth/user/openLogin", "response": { "code":0 } }
  },
  {
    "name": "bindThird",
    "method": "POST",
    "url": "/system/user/bindThird",
    "request": { "json": { "provider": "string", "token": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /system/user/bindThird", "response": { "code":0 } }
  },
  {
    "name": "unbindThird",
    "method": "POST",
    "url": "/system/user/unbindThird",
    "request": { "json": { "provider": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /system/user/unbindThird", "response": { "code":0 } }
  },
  {
    "name": "activeUserSendEmail",
    "method": "POST",
    "url": "/auth/user/active",
    "request": { "json": { "email": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /auth/user/active", "response": { "code":0 } }
  },
  {
    "name": "resetPasswordSendEmail",
    "method": "POST",
    "url": "/auth/user/reset",
    "request": { "json": { "email": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /auth/user/reset", "response": { "code":0 } }
  },
  {
    "name": "openRegister",
    "method": "POST",
    "url": "/auth/user/openRegister",
    "request": { "json": { "username": "string", "password": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /auth/user/openRegister", "response": { "code":0 } }
  },
  {
    "name": "getNoticeCount",
    "method": "GET",
    "url": "/library/notice/count",
    "request": { "params": {} },
    "response": { "data": { "count": 0 } },
    "example": { "request": "GET /library/notice/count", "response": { "code":0, "data": { "count":0 } } }
  },
  {
    "name": "getNoticeList",
    "method": "GET",
    "url": "/library/notice/list",
    "request": { "params": { "pageNum": "number" } },
    "response": { "data": { "rows": [], "total": 0 } },
    "example": { "request": "GET /library/notice/list?pageNum=1", "response": { "code":0 } }
  },
  {
    "name": "putNoticeRead",
    "method": "PUT",
    "url": "/library/notice/read",
    "request": { "json": { "ids": "array" } },
    "response": { "message": "string" },
    "example": { "request": "PUT /library/notice/read", "response": { "code":0 } }
  },
  {
    "name": "postNoticeCommentReply",
    "method": "POST",
    "url": "/library/notice/comment/reply",
    "request": { "json": { "commentId": "number", "content": "string" } },
    "response": { "data": {} },
    "example": { "request": "POST /library/notice/comment/reply", "response": { "code":0 } }
  },
  {
    "name": "postNoticeMessageSend",
    "method": "POST",
    "url": "/library/notice/message/send",
    "request": { "json": { "toUserId": "number", "content": "string" } },
    "response": { "data": {} },
    "example": { "request": "POST /library/notice/message/send", "response": { "code":0 } }
  },
  {
    "name": "sendCode",
    "method": "GET",
    "url": "/auth/user/getCode",
    "request": { "params": { "email": "string" } },
    "response": { "data": { "code": "string" } },
    "example": { "request": "GET /auth/user/getCode?email=a@b.com", "response": { "code":0, "data": { "code":"1234" } } }
  },
  {
    "name": "resetPassword",
    "method": "POST",
    "url": "/auth/user/resetPassword",
    "request": { "json": { "token": "string", "newPassword": "string" } },
    "response": { "message": "string" },
    "example": { "request": "POST /auth/user/resetPassword", "response": { "code":0 } }
  }
]

说明：
- `params` 表示通过 query string 或 axios 的 `params` 传入。
- `json` 表示请求体 JSON（通过 axios 的 `data` 传入），示例响应均为常见后端返回结构，真实字段以后端为准。

  - 响应: { rows: Array<Community>, total: number }
- GET /library/community/detail/{id}
  - 路径参数: id
  - 响应: 贴子详情对象
- GET /library/community/comment/list
  - 查询: { communityId, pageNum, pageSize }
  - 响应: { rows: Array<Comment>, total }
- POST /library/community/comment
  - 请求(body): { communityId, content, userId }
- POST /library/community/like/{id}
  - 路径参数: id（帖子 id），方法: POST（点赞）
- DELETE /library/community/like/{id}
  - 路径参数: id（取消点赞）
- GET /library/community/like/list
  - 查询参数: params（分页/用户）
- DELETE /library/community/comment/{id}
  - 路径参数: id（删除评论）

**Dashboard（仪表盘）**
- GET /dashboard/getActivityList
  - 查询: params（分页/过滤）
  - 响应: { rows, total }
- GET /dashboard/getWatchList
  - 查询: params
- GET /dashboard/getDesignerList
  - 查询: params

**Design（通用设计/收藏/历史等）**
- POST /library/follower  (follow)
  - 请求(params/body): 常见为 { userId, targetId }
- DELETE /library/follower (unFollow)
- PUT /library/collection  (renameCollection)
  - 请求(body): { id: number, name: string }
- POST /library/collection  (addCollection)
- DELETE /library/resource/{resId} (deleteResource)
- DELETE /library/comment/{resId} (deleteMake)
- PUT /library/collection/{collectionId}/resource/{resourceId} (moveResourceToCollection)
- POST /library/collection/{collectionId}/resource/{resourceId} (addResourceToCollection)
- DELETE /library/collection/{collectionId} (deleteCollection)
- GET /library/collection/list (getCollectList)
- GET /library/history/list (getHistoriesList)
- DELETE /library/history/{id} (delHistories)
- DELETE /library/history (delsHistories) -- 可能带 params 指定批量删除
- GET /library/collection/{collectionId}/resource/list (getCollectResourceList)
- DELETE /library/collection/{collectionId}/resource/{resId} (cancelCollectResource)
- GET /library/resource/list (getResourceList)
- GET /library/like/list (getLikesList)
- GET /library/follower/followings (getFollowingList)
- GET /library/follower/followers (getFollowerList)
- PUT /library/author/profile (updateDiy)
  - 请求(body): 作者个人信息对象
- GET /library/author/profile/{id} (getProfile)
- PUT /library/collection/sort (SortCollection)

**Designer**
- GET /designer/list
  - 查询: params (分页/筛选)
- GET /designer/unfollowDesigner
- GET /designer/followDesigner

**Filter / Notice / Setting（重复通用查询接口）**
- GET /select/type  (在 `filter.js`, `notice.js`, `setting.js` 多处复用)
  - 用途: 通用下拉/类型列表接口
  - 请求: 可带 `data` 或 `params`（GET 请求通常用 query）

**Groups（群组）**
- GET /groups/list
- GET /groups/members
- GET /groups/info
- GET /groups/thingsInfo
- GET /groups/groupAboutInfo
- POST /groups/changeUserGroup
- POST /groups/createGroup
  - 以上接口多使用 `params` 作为查询或表单字段，返回列表或对象

**Like（点赞）**
- POST /library/like/{resId}  addLike
  - 路径参数: resId
  - 请求: 可带 params（userId 等）
- DELETE /library/like/{resId} deleteLike
- GET /library/like/list getLikelist

**Notice（私信/通知）**
- GET /library/notice/message/list
  - 查询: params { pageNum, pageSize }
- GET /library/notice/message/detail
  - 查询: params { messageId }
- DELETE /library/notice/message/delete/{talkerId}
- POST /library/notice/message/send
  - 请求(body): { toUserId, content, ... }
- PUT /library/notice/message/read
  - 请求(body): { messageIds: [] }

**Setting（用户设置）**
- POST system/user/changeUserInfo (changeName)
  - 请求(body): { name }
- POST system/user/changePassword (changePassword)
  - 请求(body): { oldPassword, newPassword }
- POST system/user/changeEmail (changeEmail)
- GET library/author/profile/{id} (getProfileList)
- PUT library/author/profile (updateProfileList / updateNotificationsList)

**Thing（物件相关）**
- GET /thing/detail
  - 查询: params { id }
- GET /thing/downloadInfo
- GET /thing/getUserInfo
- GET /thing/getUserMakes
- GET /thing/getUserComments
- POST /thing/addUserComments
- GET /thing/getThingList
- POST /thing/changeCollect
- POST /thing/changeLike

**User（用户、认证、通知）**
- GET /user/list
- POST /auth/user/login
  - 请求(body): { username, password }
  - 响应示例: { token, user: { id, username, ... } }
- DELETE /auth/user/logout
- GET /system/user/getUserInfo
- POST /user/refresh
- GET /user/getUserInfoByUserId
- POST /user/updateProfile
- POST /user/postUserMessage
- GET /user/getFollowsByUserId
- GET /library/follower/followings
- POST /auth/user/register
- GET /library/comment/list
- GET /library/comment/detail/{commentId}
- POST /library/comment
- GET /library/comment/make/list
- GET /library/comment/detail/{commentId} (getMakeDetail)
- POST /library/comment/uploadS3
- POST /auth/user/openLogin
- POST /system/user/bindThird
- POST /system/user/unbindThird
- POST /auth/user/active (activeUserSendEmail/activeAccount)
- POST /auth/user/reset (resetPasswordSendEmail)
- POST /auth/user/openRegister
- GET /library/notice/count
- GET /library/notice/list
- PUT /library/notice/read
- POST /library/notice/comment/reply
- POST /library/notice/message/send
- GET /auth/user/getCode
- POST /auth/user/resetPassword

示例请求格式说明：
- GET 带参数: `GET /path?param1=xx&pageNum=1&pageSize=20`，axios 调用使用 `params: {}`。
- POST/PUT JSON: Header `Content-Type: application/json`，请求体为 JSON（axios 使用 `data: {...}`）。
- 文件上传: `POST /library/resource/upload`，Header `Content-Type: multipart/form-data`，body 使用 `FormData`。

示例响应常见结构：
- 列表: `{ code: 0, data: { rows: [...], total: 123 } }` 或 `{ code:0, data: [...] }`
- 单项: `{ code:0, data: { ... } }`
- 操作结果: `{ code:0, message: 'success' }`
