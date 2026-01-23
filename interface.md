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

- POST /library/collection/{collectionId}/resource/{resourceId}
  - 路径参数:
    - collectionId: number|string
    - resourceId: number|string
  - 请求（body）: 可选，函数签名允许传 `data`，但调用中通常只用路径参数
  - 响应: 操作成功/失败

- DELETE /library/collection/{collectionId}/resource/{resourceId}
  - 路径参数: collectionId, resourceId
  - 响应: 操作成功/失败

- GET /library/collection/{collectionId}/resource/list?userId={userId}
  - 路径参数: collectionId
  - 查询参数: userId
  - 响应: res.data.rows (Array<Resource>), res.data.total (number)

- GET /library/collection/resource/list
  - 查询参数: params（通用筛选/分页）
  - 响应: 常见格式为 { rows: Array, total: number }

- DELETE /library/collection/resource/{resourceId}
  - 路径参数: resourceId
  - 响应: 操作成功/失败

**资源（Resource）相关**

- POST /library/resource
  - 请求（body）: Resource 对象（字段由后端定义，示例常见字段：title, description, tags, authorId, files...）
  - 响应: 创建后的资源对象或操作结果

- GET /library/resource/detail/{id}
  - 路径参数: id
  - 响应: 资源详情（通常 res.data 或 res.data.data 为 Resource 对象）

- PUT /library/resource
  - 请求（body）: 完整或部分 Resource 对象（包含 id）
  - 响应: 更新结果/更新后的对象

- GET /library/resource/search
  - 查询参数示例:
    {
      pageSize: number,
      pageNum: number,
      sort?: 'popular'|'newest'|string,
      // 其他过滤字段可能存在
    }
  - 响应: res.data.rows (Array<Resource>), res.data.total (number)

- GET /library/resource/list
  - 查询参数: params（按条件或 id 列表检索）
  - 响应: { rows: Array<Resource>, total: number }

- GET /library/resource/list/creator
  - 查询参数: { creatorId, pageSize, pageNum }
  - 响应: { rows: Array<Resource>, total: number }

- GET /library/resource/list/similar
  - 查询参数: { resourceId, pageSize, pageNum }
  - 响应: { rows: Array<Resource>, total: number }

- GET /library/tag/list
  - 查询参数: params（筛选/分页）
  - 响应: 标签数组（如 res.data.rows 或 res.data.data）

- GET /library/author/search
  - 查询参数: params（姓名或关键词、分页）
  - 响应: 作者数组

- POST /library/resource/upload
  - 请求: multipart/form-data (`formData`)，通常含字段 `file` 或 `files`
  - 响应: 上传结果（文件 URL / id）

- POST /library/resource/uploadS3
  - 请求（body）: { filename: string, contentType?: string, ... }（依后端定义）
  - 响应: S3 上传地址/凭证，如 { uploadUrl: string, fields?: object }

- GET /library/resource/follow/list
  - 查询参数: { pageSize, pageNum }
  - 响应: res.data.rows (Array<Resource>), res.data.total (number)

---

说明与建议：
- 代码中常见响应访问模式为 `res.data.rows` 与 `res.data.total`，或 `res.data.data`（集合列表）。根据后端实际实现，`res.data` 内层可能是 `data` 或直接包含 `rows`。
- 如果需要，我可以把每个接口的入参/出参转成严格的 JSON Schema 或导出为 CSV/Markdown 表格，或补全 `Resource`/`Collection` 的字段细节（需要后端文档或示例响应）。
**概览（来源文件）**
- collection.js  
- resource.js

**提取结果 — collection.js**
- `getCollectionList(params)`  
  - 方法/URL: GET `/library/collection/list`  
  - 入参: 查询参数 `params`（示例使用：`{ userId: <user_id> }`）  
  - 出参: 响应数据置于 `res.data.data`（用于赋值为 folders，数组，每项至少含 `id`）  

- `addCollection(data)`  
  - 方法/URL: POST `/library/collection`  
  - 入参: 请求体 `data`（示例使用：`{ name: <folderName>, userId: <user_id> }`）  
  - 出参: 通常为操作成功响应（代码中未直接读取返回体，随后会调用 `getCollectionList` 更新）  

- `addResourceToCollection(data)`  
  - 方法/URL: POST `/library/collection/${data.collectionId}/resource/${data.resourceId}`  
  - 入参: 路径参数 `collectionId`, `resourceId`（调用示例：`{ collectionId, resourceId }`）；可传空或附带 `data` 作为 body（实现传参形式为 function 参数）  
  - 出参: 操作成功响应（代码中仅基于成功与否处理 UI/状态）  

- `deleteResourceInCollection(data)`  
  - 方法/URL: DELETE `/library/collection/${data.collectionId}/resource/${data.resourceId}`  
  - 入参: 路径参数 `collectionId`, `resourceId`  
  - 出参: 操作成功响应  

- `getResourceInCollection(data)`  
  - 方法/URL: GET `/library/collection/${data.collectionId}/resource/list/?userId=${data.userId}`  
  - 入参: 路径参数 `collectionId` + 查询参数 `userId`  
  - 出参: 响应结构中包含 `res.data.rows`（资源数组）和 `res.data.total`（总数），示例代码根据 `rows` 和 `total` 做判断/迭代。  

- `getCollectionResourceList(params)`  
  - 方法/URL: GET `/library/collection/resource/list`  
  - 入参: 查询参数 `params`（通用）  
  - 出参: 未在示例中具体解构，推测为资源列表响应（常见格式可能含 `rows`/`total`）。  

- `deleteCollectionResource(params)`  
  - 方法/URL: DELETE `/library/collection/resource/${params.resourceId}`  
  - 入参: 路径参数 `resourceId`（函数签名接收 `params`，调用时可能同时传 `userId`，但 URL 只用 `resourceId`）  
  - 出参: 操作成功响应（示例中基于成功刷新/修改 Vuex 状态）

**提取结果 — resource.js**
- `saveResource(data)`  
  - 方法/URL: POST `library/resource`  
  - 入参: 请求体 `data`（资源对象，字段未在示例中列出）  
  - 出参: 创建结果响应（示例未直接使用返回体）  

- `getResource(id)`  
  - 方法/URL: GET `library/resource/detail/${id}`  
  - 入参: 路径参数 `id`（资源 ID）  
  - 出参: 资源详情响应（格式代码中未展开）  

- `updateResource(data)`  
  - 方法/URL: PUT `library/resource`  
  - 入参: 请求体 `data`（包含要更新的资源字段）  
  - 出参: 更新结果响应  

- `getResourceList(params)`  
  - 方法/URL: GET `/library/resource/search`  
  - 入参: 查询参数 `params`（示例使用：分页对象 + `sort`，例如 `{ pageSize, pageNum, sort: 'popular'|'newest' }`）  
  - 出参: 响应中使用 `res.data.rows`（资源数组）和 `res.data.total`（总数量）  

- `getResourceListById(params)`  
  - 方法/URL: GET `/library/resource/list`  
  - 入参: 查询参数 `params`（按 id 列表或条件检索）  
  - 出参: 未在示例中细化（一般为资源列表）  

- `getMoreByThisCreator(params)`  
  - 方法/URL: GET `/library/resource/list/creator`  
  - 入参: 查询参数 `params`（作者相关过滤，如 `creatorId`）  
  - 出参: 资源列表响应（未细化）  

- `getSimilar(params)`  
  - 方法/URL: GET `/library/resource/list/similar`  
  - 入参: 查询参数 `params`（如 `resourceId` 等）  
  - 出参: 相似资源列表（未细化）  

- `getResourceTags(params)`  
  - 方法/URL: GET `/library/tag/list`  
  - 入参: 查询参数 `params`（筛选标签）  
  - 出参: 标签列表（未细化）  

- `getAuthorList(params)`  
  - 方法/URL: GET `/library/author/search`  
  - 入参: 查询参数 `params`（搜索作者）  
  - 出参: 作者列表（未细化）  

- `uploadFile(formData)`  
  - 方法/URL: POST `/library/resource/upload`（Content-Type: multipart/form-data）  
  - 入参: `formData`（文件数据）  
  - 出参: 上传结果（一般返回文件 URL / id）  

- `getResouceUploadS3Url(data)`  
  - 方法/URL: POST `/library/resource/uploadS3`  
  - 入参: 请求体 `data`（用于获取 S3 上传地址，字段取决后端）  
  - 出参: S3 上传地址 / 凭证响应  

- `getFollowResourceList(params)`  
  - 方法/URL: GET `/library/resource/follow/list`  
  - 入参: 查询参数 `params`（示例使用分页 `{ pageSize, pageNum }`）  
  - 出参: 响应中使用 `res.data.rows`（资源数组）和 `res.data.total`（总数）

如需我把每个接口的入参/出参格式用 JSON Schema 或表格形式列出，或者基于后端文档补全字段说明（例如集合/资源对象的具体字段），我可以继续生成更详细的规范。要我现在生成 JSON Schema 或将结果导出为 CSV/Markdown 吗？

**其余接口汇总**

**Banner**
- GET /library/banner
  - 请求（query）: 可选 `params`（例如分页或位置）
  - 示例请求:
    GET /library/banner
  - 响应示例: res.data.data => Array<{ title, image, url }>

**Comment（通用评论）**
- POST /library/comment
  - 请求（body）: {
      resourceId: number,
      content: string,
      userId?: number
    }
  - 示例请求头: `Content-Type: application/json`
  - 响应示例: { success: true, data: { id: number, content, resourceId, createdAt } }

**Community（社区）**
- POST /library/community
  - 请求(body): { title, content, userId, ... }
  - 响应: 创建结果
- GET /library/community/list
  - 查询: params { pageNum, pageSize, ... }
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
