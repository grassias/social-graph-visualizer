var webpack = require('webpack');
var path = require('path');

console.log("Current path is " + __dirname);

module.exports = () => {
  return {
    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/index.js'
    ],
    output: {
      path: path.join(__dirname + '/../public'),
      library: 'SGV',
      filename: 'sgv.js'
    },
    module: {
      loaders: [{
        loader: 'babel-loader',      
        test: /\.js$/,
        include: path.join(__dirname, '/../src'),
      }]
    },
    devServer: {
      contentBase: path.join(__dirname, '/../public'),
      hot: true
    },
    devtool: 'source-map',
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }
};