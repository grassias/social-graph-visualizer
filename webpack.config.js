var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: __dirname + '/public',
    library: 'SGV',
    filename: 'sgv.js'
  },
  module: {
    loaders: [{
      loader: 'babel-loader',      
      test: /\.js$/,
      include: path.join(__dirname, 'src'),
    }]
  },
  devServer: {
    contentBase: './public',
    hot: true
  },
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};