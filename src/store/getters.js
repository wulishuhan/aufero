const getters = {
  selectSubject: (state) => state.filterCard.selectSubject,
  selectGrade: (state) => state.filterCard.selectGrade,
  selectProfile: (state) => state.filterCard.selectProfile,
  isLogin: (state) => state.user.isLogin,
  roles: (state) => state.user.roles,
  token: (state) => state.user.accessToken,
  name: (state) => state.user.name,
  avatar: (state) => state.user.avatar,
  userId: (state) => state.user.userId,
  selectorModules: (state) => state.upload.selectorModules,
  searchKeywords: (state) => state.search.userId,
  userInfo: (state) => state.user.userInfo,
  selectCollectionBox: (state) => state.collection.selectCollectionBox,
  myFollowingList: (state) => state.user.myFollowingList,
  myLikesList: (state) => state.user.myLikesList,
  myCollectionslist: (state) => state.user.myCollectionslist,
  myNoticeCountList: (state) => state.user.myNoticeCountList,
  contactList: (state) => state.im.contactList,
  unreadCount: (state) => state.im.unreadCount,
};
export default getters;