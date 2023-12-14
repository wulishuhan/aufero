import { getCommentList, getCommentListFromId } from "@/api/user";
import { generatorDefaultAvator } from "@/utils/generateImage";
const state = {
  commentList: [],
  commentListFromId: {
    total: 0,
    rows: [],
  },
};

const mutations = {
  SET_COMMENT_LIST: (state, payload) => {
    state.commentList = payload;
  },
  LOAD_PAGE_COMMENT_LIST: (state, payload) => {
    state.commentList.push.apply(state.commentList, payload);
  },
  SET_COMMENT_LIST_FROM_ID: (state, payload) => {
    payload.rows.forEach((item) => {
      // eslint-disable-next-line
      item.user.avatar = !!item.user.avatar
        ? item.user.avatar
        : generatorDefaultAvator(item.user.name, item.user.id);
    });
    state.commentListFromId = payload;
  },
};

const actions = {
  getCommentList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getCommentList(payload)
        .then((res) => {
          res.data.rows.forEach((item) => {
            // eslint-disable-next-line
            item.user.avatar = !!item.user.avatar
              ? item.user.avatar
              : generatorDefaultAvator(item.user.name, item.user.id);
            item.replies.forEach((subItem) => {
              // eslint-disable-next-line
              subItem.user.avatar = !!subItem.user.avatar
                ? subItem.user.avatar
                : generatorDefaultAvator(subItem.user.name, subItem.user.id);
            });
          });
          commit("SET_COMMENT_LIST", res.data.rows);
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  loadPageCommentList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getCommentList(payload)
        .then((res) => {
          res.data.rows.forEach((item) => {
            // eslint-disable-next-line
            item.user.avatar = !!item.user.avatar
              ? item.user.avatar
              : generatorDefaultAvator(item.user.name, item.user.id);
            item.replies.forEach((subItem) => {
              // eslint-disable-next-line
              subItem.user.avatar = !!subItem.user.avatar
                ? subItem.user.avatar
                : generatorDefaultAvator(subItem.user.name, subItem.user.id);
            });
          });
          commit("LOAD_PAGE_COMMENT_LIST", res.data.rows);
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getCommentListFromId({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getCommentListFromId(payload)
        .then((res) => {
          commit("SET_COMMENT_LIST_FROM_ID", res.data);
          resolve(res);
        })
        .catch((error) => {
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
