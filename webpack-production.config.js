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
    main: path.resolve(__dirname, 'www/app/main.jsx'),
    // TODO: figure out how to do chunking a bit better.  Probably playing with
    // CommonsChunkPlugin is all that is needed, but the mechanism by which the
    // worker chunk is brought into existence likely needs to be understood
    // first.  Specifically, I'm worried about trying to use commons and it
    // not sufficiently understanding the separate execution scopes.  (Should
    // the worker just be a separate configuration/build?)
    /*
    composite: [
      path.resolve(gelamJSRoot, 'composite/configurator'),
      path.resolve(gelamJSRoot, 'composite/validator'),
      path.resolve(gelamJSRoot, 'composite/account'),
      path.resolve(gelamJSRoot, 'imap/gmail_tasks'),
      path.resolve(gelamJSRoot, 'imap/vanilla_tasks'),
    ],
    activesync: [
      path.resolve(gelamJSRoot, 'activesync/configurator'),
      path.resolve(gelamJSRoot, 'activesync/validator'),
      path.resolve(gelamJSRoot, 'activesync/account'),
      path.resolve(gelamJSRoot, 'activesync/activesync_tasks')
    ],
    */
  },
  resolve: {
    root: [
      // glodastrophe
      path.resolve(__dirname, 'www/lib'),
      // gelam libs
      path.resolve(__dirname, 'deps/gelam/js/ext')
    ],
    extensions: ["", ".js", ".jsx"],
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
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: '[name].js'  //Name of output file
  },
  plugins: [
    //Minify the bundle
    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    */
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      { from: 'static', to: '' }
    ], __dirname),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  module: {
    preLoaders: [
    ],
    loaders: [
      {
        test: /\.(jsx)$/, //All .js and .jsx files
        loaders: ['babel'], //react-hot is like browser sync and babel loads jsx and es6-7
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
