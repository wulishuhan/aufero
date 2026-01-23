# mock

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Temporary data structure

**user**
| id  | name | avatar | address | username | password |
| --- | ---- | ------ | ------- | -------- | -------- |

**user-settings**
| id  | user-id | introduction | who-i-am | skill-level | tools-use | website |
| --- | ------- | ------------ | -------- | ----------- | --------- | ------- |

**thing**
| id  | user-id | show-image-url | thing-name | public-time |tag |summary |license |
| --- | ------- | -------------- | ---------- | ----------- |----------- |----------- |------- |

**thing-resource-file**
| id  | thing-id | file-url | file-name | public-time | downloads |
| --- | -------- | -------- | --------- | ----------- | --------- |

**likes**
|id| thing-id | user-id |
|-| -------- | ------- |

**comments**
|id| thing-id | uid | pid | comment |
|-| -------- | --- | --- | --- |

**follows**
| id  | followed-id | user-id |
| --- | ----------- | ------- |

**groups**
| id  | name |avatar|descrption|
| --- | ---- |---|---|

**groups-number**
| id  | groups-id | user-id |
| --- | --------- | ------- |

# Temporary Error Code
| code | description                               |
| ---- | ----------------------------------------- |
| 4000 | token过期，重新获取中                     |
| 4001 | first name 长度不能超过50                 |
| 4002 | last name 长度不能超过50                  |
| 4003 | email 不能修改                            |
| 4004 | username 长度不能超过50                   |
| 4005 | 上传封面大小不能超过5M                    |
| 4006 | 上传用户头像大小不能超过2M                |
| 4007 | 上传things封面不能超过5M                  |
| 4008 | 上传things内部展示图片不能超过1M          |
| 4009 | 上传things内部展示图片不能超过20张        |
| 4010 | 上传things内部下载文件不能超过5M          |
| 4011 | 上传things名长度不能超过50                |
| 4012 | 上传things tag名长度不能超过50            |
| 4013 | 上传things summary长度不能超过1000        |
| 4014 | 上传things video url长度不能超过200       |
| 4015 | 上传things text 长度不能超过1000          |
| 4016 | 搜索字符长度不能超过50                    |
| 4017 | 搜索字符错误，请输入正确的输入信息        |
| 4018 | 1分钟内不能重复发送邮件                   |
| 4019 | 邮件错误，输入正确邮件地址                |
| 4020 | 输入正确的评论长度，长度不超过2000        |
| 4021 | 创建群组，群组名长度不超过50              |
| 4022 | 创建群组，群组url长度不超过200            |
| 4023 | 创建群组，群组url格式错误                 |
| 4024 | 创建群组，群组头像格式错误                |
| 4025 | 创建群组，群组头像大小不超过2M            |
| 4026 | 创建群组，群组介绍不能为空                |
| 4027 | 创建群组，群组介绍长度不能超过2000        |
| 4028 | 发送message，subject不能为空              |
| 4029 | 发送message，subject长度不能超过200       |
| 4030 | 发送message，message不能为空              |
| 4031 | 发送message，message长度不能超过2000      |
| 4032 | 发送message，发送过程出现错误，请重新发送 |
| 4033 | 上传videio url地址失效                    |
| 4034 | 下拉选择中未出现该选项，请重新选择        |