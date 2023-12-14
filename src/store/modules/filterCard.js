const state = {
  selectSubject: "Art",
  selectGrade: "K-6",
  selectProfile: "Favorites",
};

const mutations = {
  SET_SELECTSUBJECT: (state, subject) => {
    state.selectSubject = subject;
  },
  SET_SELECTGRADE: (state, grade) => {
    state.selectGrade = grade;
  },
  SET_SELECTPROFILE: (state, profile) => {
    state.selectProfile = profile;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
