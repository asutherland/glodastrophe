var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var gelamJSRoot = path.resolve(__dirname, 'deps/gelam/js');

/**
 * Configuration strongly derived from the example at
 * https://github.com/callemall/material-ui/blob/master/examples/webpack-example/
 */
var config = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'www/app/main.jsx'),
    'backend-main': path.resolve(__dirname, 'web-ext-src/main.js'),
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
  // Render source-map file for final build
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  resolve: {
    modules: [
      // glodastrophe
      path.resolve(__dirname, 'www/lib'),
      // gelam libs
      path.resolve(__dirname, 'deps/gelam/js/ext'),
      "node_modules"
    ],
    extensions: [".js", ".jsx"],
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
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: '[name].js',  //Name of output file
    globalObject: 'globalThis'
  },
  plugins: [
    new CleanWebpackPlugin(),
    // This prevents a million billion unique hash bundles from being created,
    // but it would be better to have explicitly named chunks since there is the
    // intent that account types are dynamically loaded.  This may result in
    // wanting 1-3 chunks per account type in the worker.
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    //new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      { from: 'static', to: '' },
      { from: 'deps/gelam/logic-inspector/build/', to: 'logic-inspector' },
      { from: 'autoconfig', to: 'autoconfig' }
    ], __dirname),
    /*
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
    */
  ],
  module: {
    rules: [
      // don't attempt to process the viz.js compiled file...
      {
        test: /\.render\.js$/,
        use: ['file-loader']
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ftl$/i,
        use: 'raw-loader',
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: 'gelam-worker.js'
        }
      },
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // "file" loader makes sure assets end up in the `build` folder.
      // When you `import` an asset, you get its filename.
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ]
  },
};

module.exports = config;
