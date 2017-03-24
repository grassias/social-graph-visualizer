var webpack = require('webpack');
var path = require('path');

module.exports = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, '/../dist/'),
      filename: 'sgv.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        include: path.join(__dirname, '/../src'),
        loader: 'babel'
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
      })
    ]
  }
};