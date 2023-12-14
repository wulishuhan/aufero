import {
  getNoticeMessageList,
  getNoticeMessageDetail,
  deleteContact,
  sendMessage,
  readMessage,
} from "@/api/notice";
import i18n from "@/utils/i18n";
import { generatorDefaultAvator } from "@/utils/generateImage";
const state = {
  contactList: [],
  unreadCount: 0,
};

const mutations = {
  GET_CONTACT_LIST: (state, payload) => {
    state.contactList = [];
    payload.forEach((item) => {
      var contact = {
        userId: item.talker.id,
        account: item.talker.name,
        avatar:
          item.talker.avatar == ""
            ? generatorDefaultAvator(item.talker.name, item.talker.id)
            : item.talker.avatar,
        latestMessage: item.content,
        nickname: item.talker.name,
        latestDatetime: new Date(item.time).getTime(),
        messageList: [],
        groupMessageList: {},
        unreadCount: item.count,
        isFriend: false,
        isOpen: false,
      };
      state.contactList.push(contact);
      state.unreadCount += item.count;
    });
  },
  ADD_CONTACT: (state, payload) => {
    state.contactList.unshift(payload);
  },
  REMOVE_CONTACT: (state, payload) => {
    state.contactList.splice(payload.index, 1);
    state.contactList = JSON.parse(JSON.stringify(state.contactList));
  },
  READ_MESSAGE: (state, payload) => {
    var contact = state.contactList[payload.index];
    state.unreadCount -= contact.unreadCount;
    contact.unreadCount = 0;
  },
  INSERT_MESSAGE: (state, payload) => {
    //排序最近联系人

    for (let i = 0; i < state.contactList.length; i++) {
      var contact = state.contactList[i];
      if (contact.userId == payload.userId) {
        contact.messageList.unshift({
          userId: payload.userId,
          message: payload.message,
          isSelf: payload.isSelf,
          type: payload.type,
          datetime: new Date().getTime(),
        });
        contact.latestMessage = payload.message;
        contact.latestDatetime = new Date().getTime();
        break;
      }
    }

    state.contactList.sort((a, b) => b.latestDatetime - a.latestDatetime);
    var data = {};
    [...contact.messageList].reverse().forEach((item) => {
      var key = item.datetime - (item.datetime % (60 * 1000));
      if (data[key]) {
        data[key].push(item);
      } else {
        data[key] = [];
        data[key].push(item);
      }
    });

    contact.groupMessageList = data;
  },

  GET_HISTORY_MESSAGE: (state, payload) => {
    var currentUserId = payload.rootState.user.userInfo.user_id;
    var contact = state.contactList[payload.currentIndex];
    if (payload.isfirst) {
      contact.messageList = [];
    }
    for (let i = 0; i < payload.data.length; i++) {
      var item = payload.data[i];
      contact.messageList.push({
        userId: item.userId,
        message: item.content,
        isSelf: item.userId == currentUserId ? true : false,
        type: "msg",
        datetime: new Date(item.time).getTime(),
      });
    }

    var data = {};
    [...contact.messageList].reverse().forEach((item) => {
      var key = item.datetime - (item.datetime % (60 * 1000));
      if (data[key]) {
        data[key].push(item);
      } else {
        data[key] = [];
        data[key].push(item);
      }
    });

    contact.groupMessageList = data;
  },
};

const actions = {
  getContactList({ commit }, payload = {}) {
    return new Promise((resolve, reject) => {
      getNoticeMessageList(payload)
        .then((res) => {
          commit("GET_CONTACT_LIST", res.data.rows);
          resolve(res.data.rows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  addContact({ commit }, payload) {
    commit("ADD_CONTACT", payload);
  },
  removeContact({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      var contact = state.contactList[payload.index];
      deleteContact(contact.userId)
        .then((res) => {
          commit("REMOVE_CONTACT", payload);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getHistoryMessage({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      getNoticeMessageDetail(payload.params)
        .then((res) => {
          resolve(res);
          commit("GET_HISTORY_MESSAGE", {
            userId: payload.params.userId,
            data: res.data.rows,
            rootState: rootState,
            currentIndex: payload.currentIndex,
            isfirst: payload.isfirst,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //读取消息
  readMessage({ commit }, payload) {
    var contact = state.contactList[payload.index];
    return new Promise((resolve) => {
      readMessage({ userId: contact.userId }).then(() => {
        commit("READ_MESSAGE", payload);
        resolve(contact);
      });
    });
  },
  reciveMessage({ state, commit, dispatch }, payload) {
    //遍历当前用户里是否有该用户消息
    for (let i = 0; i < state.contactList.length; i++) {
      if (state.contactList[i].userId == payload.payload.id) {
        state.contactList[i].unreadCount += 1;
        state.unreadCount += 1;
        commit("INSERT_MESSAGE", {
          userId: payload.payload.id,
          message: payload.payload.content,
          isSelf: false,
          type: "msg",
        });
        return;
      }
    }
    //如果不存在该用户,则更新用户列表
    dispatch("getContactList");
  },
  sendMessage({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sendMessage({
        content: payload.message,
        id: payload.toAccount,
      })
        .then((res) => {
          commit("INSERT_MESSAGE", {
            userId: payload.toAccount,
            message: payload.message,
            isSelf: true,
            type: "msg",
          });
          resolve(res);
        })
        .catch((error) => {
          commit("INSERT_MESSAGE", {
            userId: payload.toAccount,
            message: i18n.t("error.2003"),
            isSelf: true,
            type: "error",
          });
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
