import Reflux from 'reflux';

let Actions = Reflux.createActions([

  "getFrontRadioSection",
  "getProgramInfo",
  "getChannelInfo",
  "getRadioChannels",

  "getProgramComments",
  "getProgramCommentsByPage",

  "searchByPage",

  "getProgramAlbum",
  "searchAutoComplete",

  "clearSearchHistory",
  "removeSearchHistory",

  "closeOmnibox",
  "closeAutoComplete",
  "closeShareOverlay",

  "getProgramByPage",
  "updateRecoms",

  "playProgram",
  "playAlbum",

  "ShowPlayDialog",


  "pauseProgram",
  "pauseAlbum",

  "mobileProgram",
  "mobileAlbum",

  "shareProgram",
  "shareAlbum",

  "downloadProgram",
  "downloadAlbum",

  "syncProgram",

  "closePlaylist",
  "locationPush",
  "publish",
  "chargeModal",
  "updateUserFav",
  "updateShoplist",
  "updateHistory",
  "getUserInfo",
  "syncHistory",
  "refreshToken"
]);

export default Actions;