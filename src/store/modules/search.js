const state = {
  searchKeywords: "",
};

const mutations = {
  SET_SEARCH_KEYWORDS: (state, keywords) => {
    state.searchKeywords = keywords;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
