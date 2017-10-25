require('dotenv').config();

const env = {};
Object.keys(process.env).forEach(key => {
  if (key.match(/^REACT_APP_/)) {
    env[`process.env.${key}`] = `'${process.env[key]}'`;
  }
});

module.exports = {
  type: 'react-app',
  webpack: {
    define: env,
    rules: {
      babel: {
        test: /\.jsx?/
      }
    },
    publicPath: '/'
  }
};
