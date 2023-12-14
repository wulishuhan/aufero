const state = {
  selectorModules: new Set(),
  uploadForm: {},
};

const mutations = {
  SET_SELECTORMODULES: (state, selectorModules) => {
    let data = new Set([...state.selectorModules]);
    data.add(selectorModules);
    state.selectorModules = data;
  },
  DELETE_SELECTORMODULES: (state, selectorModules) => {
    let data = new Set([...state.selectorModules]);
    data.delete(selectorModules);
    state.selectorModules = data;
  },
  SET_UPLOADFORM: (state, form) => {
    console.log("SET_UPLOADFORM", form);
    state.uploadForm = form;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
