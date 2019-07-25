const path = require('path')

module.exports = {
  entry: './client/index.js',

  output: {
    path: path.join(__dirname, 'server/public'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }
}
