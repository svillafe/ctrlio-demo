var debug   = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path    = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  //Input file
  entry: "./js/client.js",
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      {
        /* 
         * Anything that is a JS file, excluding node modules and bower 
         * components, get runs through the babel-loader.
         */
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          
          /* 
           * We are going to transpile React JSX, transpile es2015 code,
           * and some feature (stage-0) no yet full incorporated in es2015.
           */
          presets: ['react', 'es2015', 'stage-0'],

          /* 
           * In addition, we are going to convert some react HTML attributtes,
           * add class properties, and we will be able to use decorators.
           */
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  //Output file
  output: {
    path: __dirname + "/src/",
    filename: "client.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};