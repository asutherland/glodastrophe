var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var gelamJSRoot = path.resolve(__dirname, 'deps/gelam/js');


/**
 * Configuration strongly derived from the example at
 * https://github.com/callemall/material-ui/blob/master/examples/webpack-example/
 */
var config = {
  entry: {
    main: [
      'webpack/hot/dev-server',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, 'www/app/main.jsx'),
    ],
    // NB: multi-entry experiments in production config
  },
  resolve: {
    root: [
      // glodastrophe
      path.resolve(__dirname, 'www/lib'),
      // gelam libs
      path.resolve(__dirname, 'deps/gelam/js/ext')
    ],    extensions: ["", ".js", ".jsx"],
    alias: {
      // glodastrophe mappings
      app: path.resolve(__dirname, 'www/app'),
      gelam: gelamJSRoot,
      logic: path.resolve(gelamJSRoot, 'logic.js'),
      app_logic: path.resolve(__dirname, 'www/app/felam'),
      locales: path.resolve(__dirname, 'www/locales'),

      // extra gelam mappings
      bleach: path.resolve(gelamJSRoot, 'ext/bleach.js/lib/bleach'),
      'imap-formal-syntax':
        path.resolve(gelamJSRoot, 'ext/imap-handler/src/imap-formal-syntax'),
      'smtpclient-response-parser':
          path.resolve(
            gelamJSRoot, 'ext/smtpclient/src/smtpclient-response-parser'),
      'wbxml': path.resolve(gelamJSRoot, 'ext/activesync-lib/wbxml/wbxml'),
      'activesync/codepages':
        path.resolve(gelamJSRoot, 'ext/activesync-lib/codepages'),
      'activesync/protocol':
        path.resolve(gelamJSRoot, 'ext/activesync-lib/protocol'),
    }
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Server Configuration options
  devServer:{
    contentBase: 'www',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    host: 'glodastrophe', // Needs to have been added to /etc/hosts or equivalent
    port: 3000        //Port Number
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: 'main.js'
  },
  plugins: [
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    //new webpack.NoErrorsPlugin(),
    //Moves files
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new TransferWebpackPlugin([
      { from: 'static', to: '' }
    ], __dirname)
  ],
  module: {
    //Loaders to interpret non-vanilla javascript code as well as most other extensions including images and text.
    preLoaders: [
    ],
    loaders: [
      {
        //React-hot loader and
        test: /\.(jsx)$/,  //All .js and .jsx files
        loaders: [/*'react-hot',*/ 'babel'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      }
    ]
  },
  worker: {
    output: {
      filename: 'gelam-worker.js'
    }
  }
};

module.exports = config;
