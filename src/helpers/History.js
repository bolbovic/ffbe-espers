import createHistory from 'history/createBrowserHistory';

export default uiSt =>
  createHistory({
    getUserConfirmation(message, callback) {
      uiSt.preventLeave = true;
      uiSt.preventCallback = callback;
    }
  });
