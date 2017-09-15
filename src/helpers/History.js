import createHistory from 'history/createBrowserHistory';

export default (uiSt) => {
  return createHistory({
    getUserConfirmation(message, callback) {
      uiSt.preventLeave = true;
      uiSt.preventCallback = callback;
    }
  });
};
