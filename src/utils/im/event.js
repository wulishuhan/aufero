export default class Event {
  //连接成功
  static CONNECT = "connect";
  static CLOSE = "close";
  static MESSAGE = "chat";
  static MESSAGE_MODIFIED = "message_modified";

  //收到好友列表更新通知
  static FRIEND_LIST_UPDATED = "friend_list_updated";

  //收到好友申请列表更新通知
  static FRIEND_APPLICATION_LIST_UPDATED = "friend_application_list_updated";

  //收到好友上线通知
  static FRIEND_ONLINE = "friend_online";
}
