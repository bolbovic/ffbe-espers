import createHistory from 'history/createBrowserHistory';

export default ui =>
  createHistory({
    getUserConfirmation(message, callback) {
      ui.preventLeave = true;
      ui.preventCallback = callback;
    }
  });
