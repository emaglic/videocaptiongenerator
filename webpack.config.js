var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
});

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
    //publicPath: '/dist'
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      ]
    },
      {
        test: /\.(css|scss)$/,
        use: extractPlugin.extract({
          use: [
            { loader: 'css-loader', options: {minimize: false}},
            { loader: 'sass-loader', options: {minimize: true}}
          ]
        })
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: './images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
  extractPlugin,
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new CleanWebpackPlugin(['dist'],
    {
      exclude: ['videos']
    }),
  new CopyWebpackPlugin([
      {
        from: './src/images',
        to: 'images'
      },
      {
        from: './src/dependencies',
        to: 'dependencies'
      }
    ])
  ]
}