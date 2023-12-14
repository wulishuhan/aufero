import ImEvent from "@/utils/im/event";
import { getToken } from "@/utils/auth";
export default class Sdk {
  _events = [];
  _socket = null;
  constructor(url, _reserved, options) {
    //eslint-disable-next-line
    var sock = new SockJS(url, _reserved, options);
    this._socket = sock;
    this._socket.onopen = () => {
      console.log("建立scoket连接");
      this.trigger(ImEvent.CONNECT);
    };
    sock.onmessage = (e) => {
      //解析消息类型，触发事件
      //获取消息类型
      const data = JSON.parse(e.data);
      if (data.type) {
        this.trigger(data.type, { data: data });
      }
    };
    sock.onclose = () => {
      this.trigger(ImEvent.CLOSE);
    };
  }

  _getMsgType(message) {
    return message.MsgBody.MsgType;
  }
  //监听的消息类型名，实例化，trigger在接收消息那里触发
  on(name, handler) {
    this._events[name] = handler;
  }
  trigger(name, event = null) {
    var eventHandler = this._events[name];
    if (eventHandler instanceof Function) {
      eventHandler(event);
    }
  }
  off(name) {
    delete this._events[name];
  }

  //黑名单列表
  getBlacklist() {}
  //重发消息
  resendMessage() {}
  //发送消息
  sendMessage(message, toAccount = 0) {
    let data = {
      token: getToken(),
      type: ImEvent.MESSAGE,
      payload: {
        content: message,
        id: toAccount,
      },
    };

    this._socket.send(JSON.stringify(data));
  }

  //创建文本消息
  createTextMessage(text) {
    return text;
  }
  scrollViewToBottom() {
    document.querySelector(
      ".chat-dialog-wrapper.active .chat-dialog-body"
    ).scrollTop = document.querySelector(
      ".chat-dialog-wrapper.active .chat-dialog-body"
    ).scrollHeight;
  }
}
